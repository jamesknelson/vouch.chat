import createDecorator from 'final-form-submit-listener'
import React, { useEffect, useRef } from 'react'
import { Form as FinalForm, useFormState } from 'react-final-form'
import getFormIssues from 'utils/getFormIssues'

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

export function FormMessage({ children, dirty, success, ...rest }) {
  let formState = useFormState()
  let issues = getFormIssues({ formState, ...rest })
  let issue = null
  let message = null
  let variant = null
  if (issues) {
    let firstIssue = Object.values(issues)[0]
    if (Array.isArray(firstIssue)) {
      firstIssue = firstIssue[0]
    }
    issue = message = firstIssue
    variant = 'warning'
  } else if (!formState.submitting && dirty && formState.dirty) {
    message = typeof dirty === 'string' ? dirty : 'You have unsaved changes.'
  } else if (formState.submitSucceeded && success) {
    message = typeof success === 'string' ? success : 'Your changes were saved.'
    variant = 'success'
  }
  return children({
    dirty: formState.dirty,
    issue,
    message,
    variant,
  })
}

export default Form
