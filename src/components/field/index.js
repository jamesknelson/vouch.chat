import humanizeString from 'humanize-string'
import React from 'react'
import { useField } from 'react-final-form'
import styled from 'styled-components/macro'

import {
  InputControl,
  SelectControl,
  TextareaControl,
} from 'components/control'
import Icon from 'components/icon'
import useControlId from 'hooks/useControlId'
import { colors, dimensions } from 'theme'

export const StyledField = styled.div`
  margin: 0 0 1rem;
  max-width: ${dimensions.defaultMaxFieldWidth};
`

export const StyledLabel = styled.label`
  color: ${props => colors.text[props.variant || 'secondary']};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 90%;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-align: left;
`

export const StyledLabelIcon = styled(Icon)`
  color: ${props => colors.control.icon[props.variant || 'default']};
  margin-right: 0.25rem;
`

export const StyledFieldMessage = styled.div`
  color: ${props => colors.text[props.variant || 'tertiary']};
  font-size: 85%;
  line-height: 1.4rem;
  margin: 0.25rem 0 0.5rem;
  text-align: left;
`

export const Field = ({
  children,
  id,
  label,
  labelGlyph,
  message,
  variant,
  ...props
}) => {
  let controlId = useControlId(id)

  return (
    <StyledField {...props}>
      {label && (
        <StyledLabel htmlFor={controlId} variant={variant}>
          {labelGlyph && (
            <StyledLabelIcon glyph={labelGlyph} size="1rem" variant={variant} />
          )}
          {label}
        </StyledLabel>
      )}
      {typeof children === 'function'
        ? children(controlId)
        : React.cloneElement(React.Children.only(children), { id: controlId })}
      <StyledFieldMessage variant={variant}>{message}</StyledFieldMessage>
    </StyledField>
  )
}

export const SelectField = ({
  message,
  label,
  labelGlyph,
  className,
  id,
  style,
  hidden,
  variant,
  ...props
}) => (
  <Field
    message={message}
    label={label}
    labelGlyph={labelGlyph}
    className={className}
    id={id}
    style={style}
    hidden={hidden}
    variant={variant}>
    <SelectControl {...props} variant={variant} />
  </Field>
)

export function FormSelectField({
  name,
  hint,
  initialValue,
  label,
  message,
  messages = {},
  ...props
}) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid
  let errorCode =
    field.meta.submitFailed &&
    ((error && field.meta.submitError) || field.meta.error)

  label = label || humanizeString(name)
  if (errorCode) {
    errorCode = messages[errorCode] || errorCode
  }

  return (
    <SelectField
      {...field.input}
      {...props}
      label={label}
      message={message || errorCode || hint}
      variant={props.variant || (error ? 'warning' : undefined)}
    />
  )
}

export const InputField = ({
  message,
  label,
  labelGlyph,
  className,
  id,
  style,
  hidden,
  variant,
  ...props
}) => (
  <Field
    message={message}
    label={label}
    labelGlyph={labelGlyph}
    className={className}
    id={id}
    style={style}
    hidden={hidden}
    variant={variant}>
    <InputControl {...props} variant={variant} />
  </Field>
)

export function FormInputField({
  name,
  hint,
  initialValue,
  label,
  message,
  messages = {},
  ...props
}) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid
  let errorCode =
    field.meta.submitFailed &&
    ((error && field.meta.submitError) || field.meta.error)

  label = label || humanizeString(name)
  if (errorCode) {
    errorCode = messages[errorCode] || errorCode
  }

  return (
    <InputField
      {...field.input}
      {...props}
      label={label}
      message={message || errorCode || hint}
      variant={props.variant || (error ? 'warning' : undefined)}
    />
  )
}

export const TextareaField = ({
  message,
  label,
  labelGlyph,
  className,
  id,
  style,
  hidden,
  variant,
  ...props
}) => (
  <Field
    message={message}
    label={label}
    labelGlyph={labelGlyph}
    className={className}
    id={id}
    style={style}
    hidden={hidden}
    variant={variant}>
    <TextareaControl {...props} variant={variant} />
  </Field>
)

export function FormTextareaField({
  name,
  hint,
  initialValue,
  label,
  message,
  messages = {},
  ...props
}) {
  let field = useField(name, {
    initialValue,
  })
  let error = field.meta.submitFailed && field.meta.invalid
  let errorCode =
    field.meta.submitFailed &&
    ((error && field.meta.submitError) || field.meta.error)

  label = label || humanizeString(name)
  if (errorCode) {
    errorCode = messages[errorCode] || errorCode
  }

  return (
    <TextareaField
      {...field.input}
      {...props}
      label={label}
      message={message || errorCode || hint}
      variant={props.variant || (error ? 'warning' : undefined)}
    />
  )
}

export default Field
