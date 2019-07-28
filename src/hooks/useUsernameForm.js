import { useEffect, useState } from 'react'

import useOperation from 'hooks/useOperation'
import updateUsername from 'operations/updateUsername'
import { getFirstIssue } from 'utils/Issues'

export default function useUsernameForm({ onSuccess } = {}) {
  let [usernameInput, setUsernameInput] = useState('')

  // Use `undefined` to indicate that we don't know if there are any
  // validation issues, and `null` to indicate that everything's okay. But
  // we'll keep it `null` for empty inputs, as that doesn't need a message.
  let [validationIssue, setValidationIssue] = useState(null)

  let operation = useOperation(updateUsername, {
    onSuccess,
  })
  let hasSubmitted = !!operation.lastError || operation.busy
  let submitIssue = getFirstIssue(operation.lastError)

  let issue = validationIssue || submitIssue

  // Run a validation on each new username input.
  useEffect(() => {
    let isMounted = true

    operation.clearSettled()

    if (usernameInput) {
      setValidationIssue(undefined)

      operation.validate({ username: usernameInput }).then(issues => {
        if (isMounted) {
          setValidationIssue(getFirstIssue(issues))
        }
      })
    } else {
      // We don't need to show any validation issues
      setValidationIssue(null)
    }

    return () => {
      isMounted = false
    }
    // We actually only want to update the issue when the user makes a change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameInput])

  let handleSubmit = async event => {
    event.preventDefault()
    operation.invoke({ username: usernameInput })
  }

  let handleChange = event => {
    setUsernameInput(typeof event === 'string' ? event : event.target.value)
  }

  let handleClickAddNumber = () => {
    let number = Math.round(Math.min(Math.random() * 10, 9))
    setUsernameInput(usernameInput + number)
  }

  let message = "Don't panic. You can change this later."
  if (hasSubmitted) {
    if (issue === 'username-taken') {
      message = 'That username is already taken, sorry.'
    } else if (issue === 'required') {
      message =
        "So you'll actually need a username. It'll appear next to your name when you cast."
    } else if (issue === 'invalid') {
      message =
        'Your username can only contain letters, numbers, and an underscore (_).'
    } else if (issue === 'premium') {
      message =
        "That's a great username. But usernames for free and little wigs must contain a number."
    } else if (submitIssue) {
      message = submitIssue
    }
  }

  let validationState
  if (usernameInput) {
    if (
      issue === 'premium' ||
      issue === 'username-taken' ||
      (!issue && validationIssue === null)
    ) {
      validationState =
        validationIssue === 'premium' || !validationIssue ? 'valid' : 'invalid'
    } else if (!issue && validationIssue === undefined) {
      validationState = 'busy'
    }
  }

  return {
    canSubmit: (!hasSubmitted || !validationIssue) && !operation.busy,
    hasSubmitted,
    isSubmitting: operation.busy,
    issue,
    message,
    onChange: handleChange,
    onClickAddNumber: handleClickAddNumber,
    onSubmit: handleSubmit,
    validationState,
    value: usernameInput,
  }
}
