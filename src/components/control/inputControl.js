import styled from 'styled-components/macro'
import React from 'react'
import { useField } from 'react-final-form'
import { Control } from './control'
import { colors, radii } from 'theme'

// The border radius on the input is set in case the browser forces the
// background-color to something other than transparent, e.g. in case of
// autofill.
const StyledInput = styled.input`
  background-color: transparent;
  color: ${colors.text.default};
  flex: 1;
  font-size: 0.9rem;
  line-height: 1rem;
  padding: 0.5rem;
  border-radius: ${radii.small};

  /* Required to allow the input to be sized with flexbox */
  width: 0;
`

export const InputControl = ({
  onChange,
  glyph,
  className,
  style,
  label,
  placeholder,
  id,
  size,
  variant,
  value,
  ...props
}) => (
  <Control
    id={id}
    glyph={glyph}
    label={label}
    variant={variant}
    className={className}
    style={style}>
    {inputProps => (
      <StyledInput
        placeholder={placeholder || label}
        value={value}
        onChange={event => onChange && onChange(event.target.value)}
        {...props}
        {...inputProps}
      />
    )}
  </Control>
)

export function FormInputControl({ name, initialValue, variant, ...props }) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid

  return (
    <InputControl
      {...field.input}
      {...props}
      variant={variant || (error && 'warning')}
    />
  )
}

export default InputControl
