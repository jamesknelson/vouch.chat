import { route } from 'navi'
import React from 'react'
import CenteredCardLayout, {
  P,
  StyledFormSubmitButton,
  RelatedLinkGroup,
  RelatedLink,
} from 'components/centeredCardLayout'
import { FormInputControl } from 'components/control'
import AuthLink from 'controls/authLink'
import { Form, FormIssue } from 'controls/form'

function Recover(props) {
  return (
    <CenteredCardLayout title="Recover your account">
      <Form onSubmit={value => {}}>
        <FormIssue>
          {message => (
            <P variant={message && 'error'}>
              {message || "Can't get in? We've got you covered."}
            </P>
          )}
        </FormIssue>
        <FormInputControl
          label="Email"
          glyph="envelope"
          name="email"
          type="email"
        />
        <StyledFormSubmitButton>Recover account</StyledFormSubmitButton>
      </Form>
      <RelatedLinkGroup>
        <RelatedLink as={AuthLink} href="/join">
          Create new account
        </RelatedLink>
        <RelatedLink as={AuthLink} href="/login/email">
          Sign in
        </RelatedLink>
      </RelatedLinkGroup>
    </CenteredCardLayout>
  )
}

export default route({
  title: 'Recover account',
  view: <Recover />,
})
