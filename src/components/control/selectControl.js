import styled from 'styled-components/macro'
import React from 'react'
import { useField } from 'react-final-form'
import { Control } from './control'
import { colors, radii } from 'theme'

// The border radius on the input is set in case the browser forces the
// background-color to something other than transparent, e.g. in case of
// autofill.
const StyledSelect = styled.select`
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

const StyledArrow = styled.div`
  position: absolute;
  right: 0.5rem;
  border: 4px solid transparent;
  border-top-color: ${colors.ink.mid};
  margin-top: 5px;

  &::after {
    content: ' ';
    position: absolute;
    border: 4px solid transparent;
    border-bottom-color: ${colors.ink.mid};
    margin-left: -4px;
    margin-top: -14px;
  }
`

export const SelectControl = ({
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
      <>
        <StyledSelect
          placeholder={placeholder || label}
          onChange={event => onChange && onChange(event.target.value)}
          {...props}
          {...inputProps}
        />
        <StyledArrow />
      </>
    )}
  </Control>
)

export function FormSelectControl({
  name,
  children,
  emptyLabel = null,
  initialValue = undefined,
  variant = undefined,
  ...props
}) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid
  let empty = field.input.value === ''

  return (
    <SelectControl
      {...field.input}
      {...props}
      variant={variant || (error && 'warning')}>
      {emptyLabel && empty && (
        <option value="" key="empty">
          {emptyLabel}
        </option>
      )}
      {children}
    </SelectControl>
  )
}

export default SelectControl
