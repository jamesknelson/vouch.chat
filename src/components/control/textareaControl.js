import styled from 'styled-components/macro'
import React from 'react'
import { useField } from 'react-final-form'
import Textarea from 'react-textarea-autosize'

import { colors, radii } from 'theme'
import { Control } from './control'

// The border radius on the input is set in case the browser forces the
// background-color to something other than transparent, e.g. in case of
// autofill.
const StyledTextarea = styled(Textarea)`
  background-color: transparent;
  color: ${colors.text.default};
  flex: 1;
  font-size: 0.9rem;
  line-height: 1rem;
  padding: 0.5rem;
  resize: none;
  border-radius: ${radii.small};

  /* Required to allow the input to be sized with flexbox */
  width: 0;

  ::placeholder {
    color: ${colors.text.placeholder};
  }
`

export const TextareaControl = ({
  onChange,
  glyph,
  className,
  style,
  label,
  minRows = 2,
  placeholder,
  id,
  size,
  validationState,
  variant,
  ...props
}) => (
  <Control
    className={className}
    glyph={glyph}
    id={id}
    label={label}
    style={style}
    variant={variant}
    validationState={validationState}>
    {inputProps => (
      <StyledTextarea
        minRows={minRows}
        placeholder={placeholder || label}
        onChange={event => onChange && onChange(event.target.value)}
        {...props}
        {...inputProps}
      />
    )}
  </Control>
)

export function FormTextareaControl({ name, initialValue, variant, ...props }) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid

  return (
    <TextareaControl
      {...field.input}
      {...props}
      variant={variant || (error && 'warning')}
    />
  )
}

export default TextareaControl
