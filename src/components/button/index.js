import React, { useState } from 'react'
import { useFormState } from 'react-final-form'
import { Link, useLoadingRoute } from 'react-navi'
import styled, { css } from 'styled-components/macro'
import { darken, lighten } from 'polished'
import { colors, easings, focusRing } from 'theme'
import { Spinner } from 'components/loading'

export const ButtonShell = styled.button`
  background-color: ${props => props.color};
  border-radius: 1.25rem;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05),
    2px 2px 2px rgba(255, 255, 255, 0.12) inset,
    -2px -2px 2px rgba(0, 0, 0, 0.08) inset;
  color: ${props => props.textColor};
  cursor: pointer;
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  align-items: center;
  font-size: ${props => (props.size === 'small' ? '0.8rem' : '0.9rem')};
  font-weight: 600;
  height: 2.5rem;
  margin: 0;
  padding: ${props => (props.size === 'small' ? '0.5rem' : '0.75rem 0.5rem')};
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: background-color 200ms ${easings.easOut},
    box-shadow 200ms ${easings.easOut}, color 200ms ${easings.easOut};
  white-space: nowrap;
  vertical-align: -25%;

  position: relative;
  ${focusRing('::after')}

  &[disabled] {
    cursor: default;
    opacity: 0.8;
  }

  ${props =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.3 !important;
      box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05);
    `}

  ${props =>
    !props.disabled &&
    css`
      &:hover {
        background-color: ${lighten(0.06, props.color)};
      }
      &:focus {
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.05),
          2px 2px 2px rgba(255, 255, 255, 0.12) inset,
          -2px -2px 2px rgba(0, 0, 0, 0.08) inset;
      }
      &:active {
        background-color: ${darken(0.06, props.color)};
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
          -2px -2px 2px rgba(255, 255, 255, 0.2) inset,
          2px 2px 2px rgba(0, 0, 0, 0.1) inset;
      }
    `}
`

ButtonShell.defaultProps = {
  color: colors.control.default,
  textColor: 'rgba(255, 255, 255, 0.95)',
  spinnerColor: 'white',
}

export const ButtonLink = ({ color, textColor, spinnerColor, ...props }) => {
  let loadingRoute = useLoadingRoute()
  let [wasClicked, setWasClicked] = useState(false)

  return (
    <Link
      {...props}
      onClick={event => {
        if (props.disabled) {
          event.preventDefault()
        } else {
          setWasClicked(true)
        }
      }}
      render={({ anchorProps, href }) => {
        let busy = wasClicked && loadingRoute
        return (
          <Button
            as="a"
            busy={busy}
            color={color}
            textColor={textColor}
            spinnerColor={spinnerColor}
            disabled={busy}
            {...anchorProps}
          />
        )
      }}
    />
  )
}

export const PenButtonLink = ({ remaining, ...props }) => {
  return <ButtonLink color={colors.ink.black} {...props} />
}

const Button = ({
  busy,
  children,
  disabled,
  testID,
  spinnerColor = 'white',
  type = 'button',
  onClick,
  ...props
}) => {
  const [handlerBusy, setHandlerBusy] = useState(false)

  const handleClick =
    onClick &&
    (async event => {
      let handlerPromise = onClick(event)
      if (handlerPromise && handlerPromise.then) {
        setHandlerBusy(true)
        await handlerPromise
        setHandlerBusy(false)
      }
    })

  if (busy === undefined) {
    busy = handlerBusy
    disabled = disabled || handlerBusy
  }

  return (
    <ButtonShell
      {...props}
      disabled={disabled}
      type={type}
      data-testid={testID}
      onClick={handleClick}>
      <Spinner
        active
        color={spinnerColor}
        size={20}
        css={css`
          flex-shrink: 0;
          position: relative;
          transition-delay: ${busy ? 150 : 0}ms;
          margin-right: 10px;
          opacity: ${busy ? 1 : 0};
          vertical-align: middle;

          opacity: ${busy ? 1 : 0};
          transform: translateX(${busy ? 0 : -50}%);
          ${busy
            ? css`
                transition: transform 300ms
                    cubic-bezier(0.895, 0.03, 0.635, 0.22),
                  opacity 250ms cubic-bezier(0.895, 0.03, 0.635, 0.22);
              `
            : css`
                transition: transform 300ms cubic-bezier(0.165, 0.84, 0.44, 1),
                  opacity 250ms cubic-bezier(0.165, 0.84, 0.44, 1);
              `}
        `}
      />
      <span
        css={css`
          ${busy
            ? css`
                transition: transform 300ms
                  cubic-bezier(0.895, 0.03, 0.635, 0.22);
              `
            : css`
                transition: transform 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
              `}
          flex-grow: 1;
          transform: translateX(${busy ? 0 : -15}px);
        `}>
        {children}
      </span>
    </ButtonShell>
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

export default Button
