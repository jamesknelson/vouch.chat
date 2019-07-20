import { useCallback, useEffect, useRef, useState } from 'react'
import normalizeIssues from 'utils/Issues'

function getPublicInvocationProperties(invocation) {
  return {
    status: invocation.status,
    params: invocation.params,
    error: invocation.error,
  }
}

function delayedReject(ms) {
  return new Promise((_, reject) => setTimeout(reject, ms))
}

useOperation.defaultReplaceThrownErrorWith = normalizeIssues(
  'Something went wrong.',
)

/**
 * You may want to notify someone that something went wrong in here.
 */
useOperation.defaultOnErrorThrown = error => {
  console.error('Unexpected error during operation:\n', error)
}

/**
 * Return an object that keeps track of invocations.
 *
 * When the passed in function returns a falsy value, it is treated as a
 * successful response, and status will become `success`.
 *
 * When some other value is returned, it is treated as an object containing
 * well-typed error messages, which will be available on `error`.
 * Status will be set to `error`.
 *
 * When an error is thrown, it is treated as containing some unexpected error.
 * In this case, the supplied `onErrorThrown` function will be called, or if
 * nothing is passed in, the default `onErrorThrown` will log a message to the
 * console, and `error` will contain the value passed in to
 * `replaceThrownErrorWith`.
 *
 * By default, `messages` is cleased on each invocation. To change this, you
 * can pass `clearSettledOnInvoke: true`.
 */
function useOperation(
  operation,
  {
    clearSettledOnInvoke = true,
    defaultProps = {},
    onError = null,
    onErrorThrown = useOperation.defaultOnErrorThrown,
    onSuccess = null,
    replaceThrownErrorWith = useOperation.defaultReplaceThrownErrorWith,
    timeout = 30000,
  } = {},
) {
  let operationRef = useRef()
  let useDependenciesRef = useRef()

  if (!operationRef.current) {
    operationRef.current = operation
  } else if (process.env.NODE_ENV !== 'production') {
    if (operationRef.current !== operation) {
      console.warn(
        'The operation passed to `useOperation()` changed. This is not supported; continuing to use the original operation.',
      )
    }
  }

  if (!useDependenciesRef.current) {
    useDependenciesRef.current = operation.useDependencies || (() => {})
  }
  let useDependencies = useDependenciesRef.current
  let dependencies = useDependencies()

  // Store invocations in ref so that they're available from the promise
  // handlers, while mirroring the public accessible properties in state so
  // that updates will be picked up by the consuming component.
  let [publicInvocations, setPublicInvocations] = useState([])
  let invocationsRef = useRef(publicInvocations)
  let updatePublicInvocations = () => {
    setPublicInvocations(
      invocationsRef.current.map(getPublicInvocationProperties),
    )
  }

  // Holds invocations that have been settled internally, but that have not
  // had their returned promise settled yet.
  let effectRequiredRef = useRef([])

  let clearSettled = useCallback(() => {
    invocationsRef.current = invocationsRef.current.filter(
      invocation => invocation.status === 'busy',
    )
    updatePublicInvocations()
  }, [])

  let validateOperation = useCallback(
    params => {
      if (operationRef.current && operationRef.current.validate) {
        return operationRef.current.validate(
          { ...defaultProps, ...params },
          dependencies,
          invocationsRef.current.map(getPublicInvocationProperties),
        )
      }
    },
    [defaultProps, dependencies],
  )

  let invokeOperation = useCallback(
    async params => {
      let paramsWithDefaults = { ...defaultProps, ...params }
      let error = await validateOperation(paramsWithDefaults)
      let outcome = error
        ? Promise.resolve(error)
        : operation(paramsWithDefaults, dependencies)
      let outcomeWithTimeout = timeout
        ? Promise.race([outcome, delayedReject(timeout)])
        : outcome
      let invocation = {
        status: 'busy',
        params,
        outcome: outcomeWithTimeout,
      }
      invocation.effect = new Promise((resolve, reject) => {
        invocation.resolve = resolve
        invocation.reject = reject
      })

      invocationsRef.current.push(invocation)

      if (clearSettledOnInvoke) {
        // This sets invocations based on the latest value of the ref.
        clearSettled()
      } else {
        updatePublicInvocations()
      }

      invocation.outcome
        .then(async error => {
          let i = invocationsRef.current.indexOf(invocation)
          let updatedInvocation = (invocationsRef.current[i] = {
            ...invocation,
            status: error ? 'error' : 'success',
            error,
          })
          if (!error) {
            if (onSuccess) {
              await onSuccess()
            } else if (onError) {
              await onError()
            }
          }
          effectRequiredRef.current.push(updatedInvocation)
          updatePublicInvocations()
        })
        .catch(async error => {
          if (onErrorThrown) {
            await onErrorThrown(error)
          }
          if (onError) {
            await onError()
          }
          let i = invocationsRef.current.indexOf(invocation)
          let updatedInvocation = (invocationsRef.current[i] = {
            ...invocation,
            status: 'error',
            error:
              replaceThrownErrorWith === undefined
                ? error
                : replaceThrownErrorWith,
          })
          effectRequiredRef.current.push(updatedInvocation)
          updatePublicInvocations()
        })

      return invocation.effect
    },
    [
      clearSettledOnInvoke,
      clearSettled,
      defaultProps,
      dependencies,
      operation,
      onError,
      onErrorThrown,
      onSuccess,
      replaceThrownErrorWith,
      timeout,
      validateOperation,
    ],
  )

  // Resolve invocation return promises in an effect, so that by the time the
  // promise is resolved, the new state will already be available on the
  // returned object.
  let effectRequired = effectRequiredRef.current
  effectRequiredRef.current = []
  useEffect(() => {
    for (let invocation of effectRequired) {
      if (invocation.status !== 'busy') {
        invocation.resolve(invocation.error)
      }
    }
  }, [effectRequired])

  let errors = publicInvocations
    .filter(invocation => invocation.status === 'error')
    .map(invocation => invocation.error)

  let lastInvocation = publicInvocations[publicInvocations.length - 1]

  let lastError = errors[errors.length - 1]
  let lastStatus = lastInvocation && lastInvocation.status

  return {
    busy: publicInvocations.some(params => params.status === 'busy'),
    clearSettled,
    error: lastError,
    errors,
    invocations: publicInvocations,
    invoke: invokeOperation,
    lastError,
    lastStatus,
    status: lastStatus,
    validate: validateOperation,
  }
}

export default useOperation
