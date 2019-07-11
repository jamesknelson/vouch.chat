import React from 'react'
import { useFormState } from 'react-final-form'
import { Link } from 'react-navi'
import AuthLink from 'controls/authLink'
import { Button } from './styles'

export { Button, IconButton, StyledLink } from './styles'

export const AuthLinkButton = props => <ButtonLink as={AuthLink} {...props} />

export const ButtonLink = ({
  as = Link,
  color,
  glyph,
  glyphColor,
  inline = false,
  passthrough,
  outline,
  ...rest
}) =>
  React.createElement(as, {
    ...rest,
    render: ({ anchorProps }) => (
      <Button
        {...anchorProps}
        as="a"
        glyph={glyph}
        glyphColor={glyphColor}
        inline={inline}
        outline={outline}
      />
    ),
  })

export function FormSubmitButton(props) {
  let formState = useFormState({
    subscription: {
      submitting: true,
    },
  })
  let submitting = !!(formState && formState.submitting)
  return (
    <Button
      {...props}
      type="submit"
      busy={submitting || props.busy}
      disabled={submitting || props.disabled}
    />
  )
}

export const LoginButton = props => (
  <AuthLinkButton {...props} href="/login" outline>
    Sign In
  </AuthLinkButton>
)

export const RegisterButton = props => (
  <AuthLinkButton {...props} href="/join">
    Join
  </AuthLinkButton>
)

export default Button
