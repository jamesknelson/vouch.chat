import { map, redirect, route } from 'navi'
import React from 'react'
import { useNavigation } from 'react-navi'

import { StyledLink } from 'components/button'
import LayoutCenteredCard, {
  Greeting,
  Instructions,
  Issue,
  StyledFormSubmitButton,
  RelatedLinkGroup,
  RelatedLink,
} from 'components/layout/layoutCenteredCard'
import { ControlGroup, FormInputControl } from 'components/control'
import Divider from 'components/divider'
import { Form, FormIssue } from 'controls/form'
import AuthLink from 'controls/authLink'
import useOperation from 'hooks/useOperation'
import emailRegister from 'operations/emailRegister'

function Join({ redirectTo, plan }) {
  let navigation = useNavigation()
  let operation = useOperation(emailRegister, {
    onSettled: async issue => {
      if (issue) {
        await navigation.getRoute()
      }
    },
  })

  return (
    <LayoutCenteredCard title="Join in">
      <Greeting>Every journey starts with a single step.</Greeting>
      <Form onSubmit={operation.invoke} validate={operation.validate}>
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
        <FormIssue>
          {message => (message ? <Issue>{message}</Issue> : null)}
        </FormIssue>
        <StyledFormSubmitButton>Join in</StyledFormSubmitButton>
      </Form>
      <RelatedLinkGroup>
        <RelatedLink as={AuthLink} href="/login">
          Sign in
        </RelatedLink>
        <RelatedLink as={AuthLink} href="/recover">
          Recover account
        </RelatedLink>
      </RelatedLinkGroup>
      <Divider />
      <Instructions>
        Please only join if you agree to our marvellous{' '}
        <StyledLink href="/pages/privacy">Privacy Policy</StyledLink>, your{' '}
        <StyledLink href="/pages/conduct">Code of Conduct</StyledLink>, and the{' '}
        <StyledLink href="/pages/privacy">Terms of Service</StyledLink>.
      </Instructions>
    </LayoutCenteredCard>
  )
}

export default map(({ context, params }) => {
  // Only redirect automatically if the user was already logged in when they
  // first landed at this page, as otherwise we'll want to t
  if (context.currentUser) {
    return redirect('/welcome')
  }

  return route({
    data: {
      auth: true,
    },
    title: 'Join',
    view: <Join {...params} />,
  })
})
