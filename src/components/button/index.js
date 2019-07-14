import React from 'react'
import { useFormState } from 'react-final-form'
import { useLinkProps } from 'react-navi'

import useAuthURL from 'hooks/useAuthURL'
import { Button } from './styles'

export { Button, IconButton, StyledLink } from './styles'

export const AuthLinkButton = ({ href, ...rest }) => {
  let url = useAuthURL(href)
  return <ButtonLink href={url} {...rest} />
}

export const ButtonLink = ({
  color,
  glyph,
  glyphColor,
  inline = false,
  outline,
  ...rest
}) => {
  let anchorProps = useLinkProps(rest)
  return (
    <Button
      {...anchorProps}
      as="a"
      glyph={glyph}
      glyphColor={glyphColor}
      inline={inline}
      outline={outline}
    />
  )
}

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
