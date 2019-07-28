import createDecorator from 'final-form-submit-listener'
import React, { useEffect, useRef } from 'react'
import { Form as FinalForm, useFormState } from 'react-final-form'

import { Message } from 'components/message'
import getFormIssues from 'utils/getFormIssues'
import { getFirstIssue } from 'utils/Issues'

export function Form({
  children,
  className,
  as: Component = 'form',
  style,
  onRequestSubmit,
  onSubmitSucceeded,
  onSubmitFailed,
  ...props
}) {
  let submitCallbacksRef = useRef({
    onRequestSubmit,
    onSubmitSucceeded,
    onSubmitFailed,

    lastSubmittedValues: null,
  })

  useEffect(() => {
    submitCallbacksRef.current = {
      onRequestSubmit,
      onSubmitSucceeded,
      onSubmitFailed,
    }
  }, [onRequestSubmit, onSubmitSucceeded, onSubmitFailed])

  let formSubmitCallbacksRef = useRef()
  if (!formSubmitCallbacksRef.current) {
    formSubmitCallbacksRef.current = createDecorator({
      beforeSubmit: form => {
        let values = form.getState().values

        submitCallbacksRef.current.lastSubmittedValues = values

        if (submitCallbacksRef.current.onRequestSubmit) {
          submitCallbacksRef.current.onRequestSubmit(values, form)
        }
      },
      afterSubmitSucceeded: form => {
        // Reset the form to the submitted values, so that
        // `pristine` and `dirty` no longer show any changes.
        form.initialize(submitCallbacksRef.current.lastSubmittedValues)

        if (submitCallbacksRef.current.onSubmitSucceeded) {
          submitCallbacksRef.current.onSubmitSucceeded(
            form.getState().values,
            form,
          )
        }
      },
      afterSubmitFailed: form => {
        if (submitCallbacksRef.current.onSubmitFailed) {
          submitCallbacksRef.current.onSubmitFailed(
            form.getState().values,
            form,
          )
        }
      },
    })
  }

  return (
    <FinalForm decorators={[formSubmitCallbacksRef.current]} {...props}>
      {({ handleSubmit }) =>
        React.createElement(Component, {
          children,
          className,
          onSubmit: handleSubmit,
          style,
        })
      }
    </FinalForm>
  )
}

const defaultFormMessageChildren = ({ message, ...rest }) => (
  <Message name={message} marginTop="0.5rem" textAlign="left" {...rest} />
)

export function FormMessage({
  children = defaultFormMessageChildren,
  dirty,
  success,
  except,
  only,
  defaultInvalidMessage,
  defaultSubmitFailedMessage,
  ...rest
}) {
  let formState = useFormState()
  let issues = getFormIssues({
    formState,
    except,
    only,
    defaultInvalidMessage,
    defaultSubmitFailedMessage,
  })
  let message = null
  let variant = null
  if (issues) {
    let firstIssue = getFirstIssue(issues)
    message = firstIssue
    variant = firstIssue ? 'issue' : null
  } else if (!formState.submitting && dirty && formState.dirty) {
    message = typeof dirty === 'string' ? dirty : 'dirty'
    variant = 'dirty'
  } else if (formState.submitSucceeded && success) {
    message = typeof success === 'string' ? success : 'success'
    variant = 'success'
  }
  return children({
    message,
    variant,
    ...rest,
  })
}

export default Form
