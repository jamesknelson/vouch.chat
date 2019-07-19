import { mount, route } from 'navi'
import React from 'react'
import { useNavigation } from 'react-navi'

import { FormSubmitButton, LoginButton } from 'components/button'
import SmallCardLayout, {
  Instructions,
  RelatedLinkGroup,
  RelatedLink,
} from 'components/smallCardLayout'
import { FormInputField } from 'components/field'
import AuthLink from 'controls/authLink'
import { Form } from 'controls/form'
import useOperation from 'hooks/useOperation'
import sendPasswordResetEmail from 'operations/sendPasswordResetEmail'
import { Gap } from 'components/sections'

function Recover(props) {
  let navigation = useNavigation()
  let operation = useOperation(sendPasswordResetEmail)

  return (
    <SmallCardLayout title="Recover your account">
      <Instructions>
        Can't login to your account? Just enter your email to reset your
        password.
      </Instructions>
      <Form
        validate={operation.validate}
        onSubmit={operation.invoke}
        onSubmitSucceeded={() => {
          navigation.navigate('/recover/sent')
        }}>
        <FormInputField
          label="Your email"
          glyph="envelope1"
          name="email"
          type="email"
          showLabelAsPlaceholder
        />
        <Gap size={1} />
        <FormSubmitButton width="100%">Recover account</FormSubmitButton>
      </Form>
      <RelatedLinkGroup>
        <RelatedLink as={AuthLink} href="/join">
          Create new account
        </RelatedLink>
        <RelatedLink as={AuthLink} href="/login/email">
          Sign in
        </RelatedLink>
      </RelatedLinkGroup>
    </SmallCardLayout>
  )
}

export const ForgotPasswordSent = () => {
  return (
    <SmallCardLayout title="One more step.">
      <Instructions>
        I've just sent you an email. Follow the link in the email to reset your
        password.
      </Instructions>
    </SmallCardLayout>
  )
}

export default mount({
  '/': route({
    data: {
      minimalLayout: true,
      layoutHeaderActions: <LoginButton style={{ marginRight: '0.75rem' }} />,
    },
    view: <Recover />,
  }),
  '/sent': route({
    data: {
      minimalLayout: true,
      layoutHeaderActions: <LoginButton style={{ marginRight: '0.75rem' }} />,
    },
    view: <ForgotPasswordSent />,
  }),
})
