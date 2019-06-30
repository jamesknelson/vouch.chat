import { mount, route } from 'navi'
import React from 'react'
import { useNavigation } from 'react-navi'
import CenteredCardLayout, {
  Instructions,
  StyledFormSubmitButton,
  RelatedLinkGroup,
  RelatedLink,
} from 'components/centeredCardLayout'
import { FormInputField } from 'components/field'
import AuthLink from 'controls/authLink'
import { Form } from 'controls/form'
import useOperation from 'hooks/useOperation'
import sendPasswordResetEmail from 'operations/sendPasswordResetEmail'

function Recover(props) {
  let navigation = useNavigation()
  let operation = useOperation(sendPasswordResetEmail)

  return (
    <CenteredCardLayout title="Recover your account">
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
          labelGlyph="envelope"
          name="email"
          type="email"
          showLabelAsPlaceholder
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

export const ForgotPasswordSent = () => {
  return (
    <CenteredCardLayout title="One more step.">
      <Instructions>
        I've just sent you an email. Follow the link in the email to reset your
        password.
      </Instructions>
    </CenteredCardLayout>
  )
}

export default mount({
  '/': route({
    data: {
      auth: true,
    },
    view: <Recover />,
  }),
  '/sent': route({
    data: {
      auth: true,
    },
    view: <ForgotPasswordSent />,
  }),
})
