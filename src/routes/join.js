import { route } from 'navi'
import React from 'react'
import emailRegister from 'actions/emailRegister'
import { StyledLink } from 'components/button'
import CenteredCardLayout, {
  P,
  StyledFormSubmitButton,
  RelatedLinkGroup,
  RelatedLink,
} from 'components/centeredCardLayout'
import { ControlGroup, FormInputControl } from 'components/control'
import Divider from 'components/divider'
import { Form, FormIssue } from 'controls/form'
import AuthLink from 'controls/authLink'
import useNavigateAfterLogin from 'hooks/useNavigateAfterLogin'

function Join({ redirectTo, plan }) {
  let navigateAfterLogin = useNavigateAfterLogin({ redirectTo, plan })

  return (
    <CenteredCardLayout title="Join in">
      <Form
        onSubmit={async value => {
          await emailRegister(value)
          await navigateAfterLogin()
        }}
        validate={emailRegister.validate}>
        <FormIssue>
          {message => (
            <P variant={message && 'error'}>
              {message || 'Every great journey begins with a single step.'}
            </P>
          )}
        </FormIssue>
        <ControlGroup>
          <FormInputControl label="Name" glyph="person" name="name" />
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
        <StyledFormSubmitButton>Join in</StyledFormSubmitButton>
      </Form>
      <RelatedLinkGroup>
        <RelatedLink href="/login/email">Sign in</RelatedLink>
        <RelatedLink href="/recover">Recover account</RelatedLink>
      </RelatedLinkGroup>
      <Divider />
      <P>
        Please only join if you agree to our marvellous{' '}
        <StyledLink as={AuthLink} href="/pages/privacy">
          Privacy Policy
        </StyledLink>
        , your{' '}
        <StyledLink as={AuthLink} href="/pages/conduct">
          Code of Conduct
        </StyledLink>
        , and the{' '}
        <StyledLink as={AuthLink} href="/pages/privacy">
          Terms of Service
        </StyledLink>
        .
      </P>
    </CenteredCardLayout>
  )
}

export default route({
  title: 'Join',
  getView: ({ params }) => <Join {...params} />,
})
