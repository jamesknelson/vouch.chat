import { map, redirect, route } from 'navi'
import React from 'react'
import { useNavigation } from 'react-navi'

import { FormSubmitButton, LoginButton, StyledLink } from 'components/button'
import SmallCardLayout, {
  Greeting,
  Instructions,
  RelatedLinkGroup,
  RelatedLink,
} from 'components/smallCardLayout'
import { ControlGroup, FormInputControl } from 'components/control'
import Divider from 'components/divider'
import { Form, FormMessage } from 'components/form'
import { Gap } from 'components/responsive'
import AuthLink from 'components/authLink'
import useOperation from 'hooks/useOperation'
import emailRegister from 'operations/emailRegister'

function Join() {
  let navigation = useNavigation()
  let operation = useOperation(emailRegister, {
    onSuccess: async () => {
      await navigation.getRoute()
    },
  })

  return (
    <SmallCardLayout title="Join in">
      <Greeting>Every journey starts with a single step.</Greeting>
      <Form onSubmit={operation.invoke} validate={operation.validate}>
        <ControlGroup>
          <FormInputControl label="Name" glyph="person" name="name" />
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
        <FormMessage />
        <Gap />
        <FormSubmitButton width="100%">Join in</FormSubmitButton>
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
        <StyledLink href="/pages/policies">Policies and Terms</StyledLink>..
      </Instructions>
    </SmallCardLayout>
  )
}

export default map(({ context, params }) => {
  // Only redirect automatically if the user was already logged in when they
  // first landed at this page.
  if (context.currentUser) {
    return redirect('/welcome')
  }

  return route({
    data: {
      minimalLayout: true,
      layoutHeaderActions: <LoginButton style={{ marginRight: '0.75rem' }} />,
    },
    title: 'Join',
    view: <Join />,
  })
})
