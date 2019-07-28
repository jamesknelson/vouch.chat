import { map, redirect, route } from 'navi'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-navi'
import { css } from 'styled-components/macro'

import { FormSubmitButton, StyledLink } from 'components/button'
import { FormInputField } from 'components/field'
import Form, { FormMessage } from 'components/form'
import SmallCardLayout, { Instructions } from 'components/smallCardLayout'
import useOperation from 'hooks/useOperation'
import resetPassword from 'operations/resetPassword'
import loading, { Loading } from './loading'

export const ResetPassword = props => {
  let navigation = useNavigation()
  let operation = useOperation(resetPassword, {
    defaultProps: {
      email: props.email,
      code: props.code,
    },
    onSuccess: async () => {
      await navigation.navigate('/')
    },
  })

  if (!props.email) {
    return (
      <SmallCardLayout title="Oops">
        <Instructions>
          This account recovery link has expired. Please get a new link at the{' '}
          <StyledLink href="/recover">recover account</StyledLink> page.
        </Instructions>
      </SmallCardLayout>
    )
  }

  return (
    <SmallCardLayout title="One more step...">
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
        <FormMessage except={['password', 'passwordConfirmation']} />
        <FormSubmitButton
          css={css`
            margin-top: 1.5rem;
            width: 100%;
          `}>
          Change Password
        </FormSubmitButton>
      </Form>
    </SmallCardLayout>
  )
}

function ReloadAfterVerification({ backend }) {
  let [verified, setVerified] = useState(null)

  useEffect(() => {
    // This will cause the route to be recomputed so we can't do it in the
    // map() call or it'll create an infinite loop.
    backend.currentUser.reload().then(() => {
      setVerified(backend.currentUser.emailVerified)
    })
  }, [backend])

  if (verified === false) {
    return (
      <SmallCardLayout title="Oops">
        <Instructions>Your account couldn't be verified.</Instructions>
      </SmallCardLayout>
    )
  }

  return <Loading />
}

export default map(async ({ context, params, mountpath }) => {
  let { currentUser, backend } = context

  if (currentUser === undefined) {
    return loading
  }

  // Modes:
  // - recoverEmail: switch back to a previous email if someone's email address is changed.
  // - verifyEmail: verify new emails.
  // - resetPassword: part of the recover account flow.
  const { mode, oobCode, ...query } = params
  if (mode === 'verifyEmail' || mode === 'recoverEmail') {
    if (oobCode && (!currentUser || !currentUser.emailVerified)) {
      await backend.auth.applyActionCode(oobCode)
    }
    if (currentUser === null) {
      // `applyActionCode` doesn't automatically log in the user, so if
      // they're logged out, we should redirect them to the login page.
      return redirect('/login')
    }
    if (mode === 'recoverEmail') {
      return redirect('/?recovered')
    }
    if (mode === 'verifyEmail') {
      if (currentUser.emailVerified) {
        return redirect('/welcome?verified')
      } else if (oobCode) {
        // Redirect to the same URL without the oobcode, so we won't try to
        // the same action code again.
        return redirect({ query: { ...query, mode }, pathname: mountpath })
      } else {
        // Display the verification status/result.
        return route({
          view: <ReloadAfterVerification backend={backend} />,
        })
      }
    }
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
