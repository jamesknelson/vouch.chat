import { mount, route } from 'navi'
import React from 'react'

import emailLogin from 'actions/emailLogin'
import { StyledLink } from 'components/button'
import { ControlGroup, FormInputControl } from 'components/control'
import CenteredCardLayout, {
  P,
  RelatedLink,
  RelatedLinkGroup,
  StyledButton,
  StyledButtonLink,
  StyledFormSubmitButton,
} from 'components/centeredCardLayout'
import Divider from 'components/divider'
import AuthLink from 'controls/authLink'
import { Form, FormIssue } from 'controls/form'
import useNavigateAfterLogin from 'hooks/useNavigateAfterLogin'

function Login(props) {
  return (
    <CenteredCardLayout title="Sign in">
      <P>I'll vouch for you.</P>
      <StyledButtonLink glyph="envelope" href="/login/email">
        Sign in with Email
      </StyledButtonLink>
      <StyledButton glyph="facebook" color="#4267b2" outline>
        Sign in with Facebook
      </StyledButton>
      <StyledButton glyph="google" color="#ea4335" outline>
        Sign in with Google
      </StyledButton>
      <StyledButton glyph="twitter" color="#00ACED" outline>
        Sign in with Twitter
      </StyledButton>
      <Divider />
      <P>
        Please sign in only if you agree to our marvellous{' '}
        <StyledLink href="/pages/privacy">Privacy Policy</StyledLink>, your{' '}
        <StyledLink href="/pages/conduct">Code of Conduct</StyledLink>, and the{' '}
        <StyledLink href="/pages/privacy">Terms of Service</StyledLink>.
      </P>
    </CenteredCardLayout>
  )
}

function EmailLogin({ redirectTo = '', plan }) {
  let navigateAfterLogin = useNavigateAfterLogin({ redirectTo, plan })

  return (
    <CenteredCardLayout title="Sign in">
      <Form
        onSubmit={async value => {
          await emailLogin(value)
          await navigateAfterLogin()
        }}
        validate={emailLogin.validate}>
        <FormIssue>
          {message => (
            <P variant={message && 'error'}>
              {message || "I'll vouch for you."}
            </P>
          )}
        </FormIssue>
        <ControlGroup>
          <FormInputControl
            label="Email"
            glyph="envelope"
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
      <P>
        Please sign in only if you agree to our marvellous{' '}
        <StyledLink href="/pages/privacy">Privacy Policy</StyledLink>, your{' '}
        <StyledLink href="/pages/conduct">Code of Conduct</StyledLink>, and the{' '}
        <StyledLink href="/pages/privacy">Terms of Service</StyledLink>.
      </P>
    </CenteredCardLayout>
  )
}

export default mount({
  '/': route({
    title: 'Sign in',
    view: <Login />,
  }),
  '/email': route({
    title: 'Sign in with Email',
    getView: ({ params }) => <EmailLogin {...params} />,
  }),
})
