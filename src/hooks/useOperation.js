import { useCallback, useEffect, useRef, useState } from 'react'

function getPublicInvocationProperties(invocation) {
  return {
    status: invocation.status,
    params: invocation.params,
    value: invocation.value,
    error: invocation.error,
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Return an object that keeps track of invocations.
 *
 * By default, the latest result will be available in `error` or `value`,
 * until the next `invoke()` is called. To change this behavior, you can
 * set `clearSettledOnInvoke` to false.
 */
function useOperation(
  operation,
  {
    clearSettledOnInvoke = true,
    defaultProps = {},
    onSettled = null,
    timeout = null,
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
        ? Promise.race([outcome, delay(timeout)])
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
        .then(async value => {
          let i = invocationsRef.current.indexOf(invocation)
          let updatedInvocation = (invocationsRef.current[i] = {
            ...invocation,
            status: 'value',
            value,
          })
          effectRequiredRef.current.push(updatedInvocation)
          if (onSettled) {
            await onSettled(value)
          }
          updatePublicInvocations()
        })
        .catch(error => {
          let i = invocationsRef.current.indexOf(invocation)
          let updatedInvocation = (invocationsRef.current[i] = {
            ...invocation,
            status: 'error',
            error,
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
      onSettled,
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
        if (invocation.status === 'value') {
          invocation.resolve(invocation.value)
        } else {
          invocation.reject(invocation.error)
        }
      }
    }
  }, [effectRequired])

  let errors = publicInvocations
    .filter(invocation => invocation.status === 'error')
    .map(invocation => invocation.error)
  let values = publicInvocations
    .filter(invocation => invocation.status === 'value')
    .map(invocation => invocation.value)

  let lastInvocation = publicInvocations[publicInvocations.length - 1]

  let lastError = errors[errors.length - 1]
  let lastValue = values[values.length - 1]
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
    lastValue,
    validate: validateOperation,
    value: lastValue,
    values,
  }
}

export default useOperation
