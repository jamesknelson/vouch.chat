import { compose, lazy, map, mount, redirect, route, withData } from 'navi'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from 'react-navi'

import { RegisterButton, StyledLink } from 'components/button'
import { ControlGroup, FormInputControl } from 'components/control'
import LayoutCenteredCard, {
  Greeting,
  Instructions,
  Issue,
  RelatedLink,
  RelatedLinkGroup,
  StyledAuthButtonLink,
  StyledButton,
  StyledFormSubmitButton,
} from 'components/layout/layoutCenteredCard'
import Divider from 'components/divider'
import AuthLink from 'controls/authLink'
import { Form, FormIssue } from 'controls/form'
import useOperation from 'hooks/useOperation'
import emailLogin from 'operations/emailLogin'
import socialLogin from 'operations/socialLogin'

function useSocialLoginOperation(providerName) {
  // If nothing goes wrong, wait for navigation to complete before removing
  // the busy indicator.
  let navigation = useNavigation()
  let onSettled = useCallback(
    async issue => {
      if (issue) {
        await navigation.getRoute()
      }
    },
    [navigation],
  )
  let operation = useOperation(socialLogin, {
    defaultProps: {
      providerName,
    },
    onSettled,
  })
  operation.providerName = providerName
  return operation
}

function Login(props) {
  let [previousLoginProvider, setPreviousLoginProvider] = useState(
    props.previousLoginProvider.initialSnapshot.data(),
  )
  useEffect(() =>
    props.previousLoginProvider.doc.onSnapshot(next => {
      setPreviousLoginProvider(next.data())
    }),
  )

  let facebookLoginOperation = useSocialLoginOperation('FacebookAuthProvider')
  let googleLoginOperation = useSocialLoginOperation('GoogleAuthProvider')
  let twitterLoginOperation = useSocialLoginOperation('TwitterAuthProvider')

  let login = operation => {
    setPreviousLoginProvider(operation.providerName)
    facebookLoginOperation.clearSettled()
    googleLoginOperation.clearSettled()
    twitterLoginOperation.clearSettled()
    operation.invoke()
  }

  let disabled =
    facebookLoginOperation.busy ||
    googleLoginOperation.busy ||
    twitterLoginOperation.busy

  return (
    <LayoutCenteredCard title="Sign in">
      <Greeting>
        {props.required !== undefined
          ? "You'll need to login to access that feature."
          : "I'll vouch for you."}
      </Greeting>
      <StyledAuthButtonLink
        glyph="envelope1"
        href="/login/email"
        disabled={disabled}
        outline={disabled || previousLoginProvider !== undefined}>
        Sign in with Email
      </StyledAuthButtonLink>
      <StyledButton
        glyph="facebook"
        color="#4267b2"
        outline={
          (!facebookLoginOperation.busy && disabled) ||
          previousLoginProvider !== facebookLoginOperation.providerName
        }
        disabled={disabled}
        busy={facebookLoginOperation.busy}
        onClick={() => login(facebookLoginOperation)}>
        Sign in with Facebook
      </StyledButton>
      {facebookLoginOperation.value && (
        <Issue style={{ textAlign: 'center' }}>
          {Object.values(facebookLoginOperation.value)[0]}
        </Issue>
      )}
      <StyledButton
        glyph="google"
        color="#ea4335"
        outline={
          (!googleLoginOperation.busy && disabled) ||
          previousLoginProvider !== googleLoginOperation.providerName
        }
        disabled={disabled}
        busy={googleLoginOperation.busy}
        onClick={() => login(googleLoginOperation)}>
        Sign in with Google
      </StyledButton>
      <StyledButton
        glyph="twitter"
        color="#00ACED"
        outline={
          (!twitterLoginOperation.busy && disabled) ||
          previousLoginProvider !== twitterLoginOperation.providerName
        }
        disabled={disabled}
        busy={twitterLoginOperation.busy}
        onClick={() => login(twitterLoginOperation)}>
        Sign in with Twitter
      </StyledButton>
      <Divider />
      <Instructions>
        Please sign in only if you agree to our marvellous{' '}
        <StyledLink href="/pages/privacy">Privacy Policy</StyledLink>, your{' '}
        <StyledLink href="/pages/conduct">Code of Conduct</StyledLink>, and the{' '}
        <StyledLink href="/pages/privacy">Terms of Service</StyledLink>.
      </Instructions>
    </LayoutCenteredCard>
  )
}

function EmailLogin(props) {
  let navigation = useNavigation()
  let emailLoginDependencies = emailLogin.useDependencies()

  return (
    <LayoutCenteredCard title="Sign in">
      <Form
        onSubmit={async value => {
          let error = await emailLogin(value, emailLoginDependencies)
          if (error) {
            return error
          }

          await navigation.getRoute()
        }}
        validate={value => emailLogin.validate(value, emailLoginDependencies)}>
        <Greeting>I'll vouch for you.</Greeting>
        <ControlGroup>
          <FormInputControl
            label="Email"
            glyph="envelope1"
            name="email"
            type="email"
          />
          <FormInputControl
            label="Password"
            glyph="lock"
            name="password"
            type="password"
          />
        </ControlGroup>
        <FormIssue>
          {message => (message ? <Issue>{message}</Issue> : null)}
        </FormIssue>
        <StyledFormSubmitButton>Sign in</StyledFormSubmitButton>
      </Form>
      <RelatedLinkGroup>
        <RelatedLink as={AuthLink} href="/join">
          Create account
        </RelatedLink>
        <RelatedLink as={AuthLink} href="/recover">
          Recover account
        </RelatedLink>
        <RelatedLink as={AuthLink} href="/login">
          Other login options
        </RelatedLink>
      </RelatedLinkGroup>
      <Divider />
      <Instructions>
        Please sign in only if you agree to our marvellous{' '}
        <StyledLink href="/pages/privacy">Privacy Policy</StyledLink>, your{' '}
        <StyledLink href="/pages/conduct">Code of Conduct</StyledLink>, and the{' '}
        <StyledLink href="/pages/privacy">Terms of Service</StyledLink>.
      </Instructions>
    </LayoutCenteredCard>
  )
}

export default compose(
  withData({
    minimalLayout: true,
    layoutHeaderActions: <RegisterButton style={{ marginRight: '0.75rem' }} />,
  }),
  map(async ({ context, params }) => {
    let { backend, currentUser } = context

    if (currentUser === undefined) {
      return lazy(() => import('./loading'))
    } else if (currentUser) {
      return redirect(params.redirectTo || '/read', { exact: false })
    } else {
      let previousLoginProviderDoc = backend.deviceConfig.previousLoginProvider

      return mount({
        '/': route({
          title: 'Sign in',
          view: (
            <Login
              {...params}
              previousLoginProvider={{
                doc: previousLoginProviderDoc,
                initialSnapshot: await previousLoginProviderDoc.get(),
              }}
            />
          ),
        }),
        '/email': route({
          title: 'Sign in with Email',
          view: <EmailLogin {...params} />,
        }),
      })
    }
  }),
)
