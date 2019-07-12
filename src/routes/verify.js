import { map, redirect, route } from 'navi'
import React from 'react'
import { useNavigation } from 'react-navi'
import { css } from 'styled-components/macro'

import { StyledLink } from 'components/button'
import LayoutCenteredCard, {
  Instructions,
  Issue,
  StyledFormSubmitButton,
} from 'components/layout/layoutCenteredCard'
import { FormInputField } from 'components/field'
import Form, { FormIssue } from 'controls/form'
import useOperation from 'hooks/useOperation'
import resetPassword from 'operations/resetPassword'
import loading from './loading'

export const ResetPassword = props => {
  let navigation = useNavigation()
  let operation = useOperation(resetPassword, {
    defaultProps: {
      email: props.email,
      code: props.code,
    },
    onSettled: async error => {
      if (!error) {
        await navigation.navigate('/')
      }
    },
  })

  if (!props.email) {
    return (
      <LayoutCenteredCard title="Oops">
        <Instructions>
          This account recovery link has expired. Please get a new link at the{' '}
          <StyledLink href="/recover">recover account</StyledLink> page.
        </Instructions>
      </LayoutCenteredCard>
    )
  }

  return (
    <LayoutCenteredCard title="One more step...">
      <Instructions>Please set a new password below.</Instructions>
      <Form validate={operation.validate} onSubmit={operation.invoke}>
        <FormInputField
          label="New password"
          glyph="lock"
          name="password"
          type="password"
        />
        <FormInputField
          label="Retype new password"
          glyph="lock"
          name="passwordConfirmation"
          type="password"
        />
        <FormIssue except={['password', 'passwordConfirmation']}>
          {message => (message ? <Issue>{message}</Issue> : null)}
        </FormIssue>
        <StyledFormSubmitButton
          css={css`
            margin-top: 1.5rem;
          `}>
          Change Password
        </StyledFormSubmitButton>
      </Form>
    </LayoutCenteredCard>
  )
}

export default map(async ({ context, params }) => {
  let { currentUser, backend } = context

  if (currentUser === undefined) {
    return loading
  }

  // Modes:
  // - recoverEmail: switch back to a previous email if someone's email address is changed.
  // - verifyEmail: verify new emails.
  // - resetPassword: part of the recover account flow.
  const { mode, oobCode } = params
  if (mode === 'verifyEmail' || mode === 'recoverEmail') {
    if (!currentUser || !currentUser.emailVerified) {
      await backend.auth.applyActionCode(oobCode)
    }
    return redirect(
      mode === 'verifyEmail' ? '/welcome?verified' : '/?recovered',
    )
  } else if (mode === 'resetPassword') {
    let email
    try {
      email = await backend.auth.verifyPasswordResetCode(oobCode)
    } catch (error) {}

    return route({
      data: {
        minimalLayout: true,
      },
      view: <ResetPassword code={oobCode} email={email} />,
    })
  } else {
    throw new Error('Unknown verification mode')
  }
})
