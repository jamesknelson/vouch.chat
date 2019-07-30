import { rgba } from 'polished'
import React from 'react'
import { Link } from 'react-navi'
import { animated, useSpring, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import { layout, space } from 'styled-system'

import { colors, easings, focusRing, radii, shadows, media } from 'theme'
import Icon from 'components/icon'
import { Spinner } from 'components/loading'
import Tooltip from 'components/tooltip'

export const StyledLink = styled(Link)`
  border: none;
  border-radius: ${radii.medium};
  color: ${colors.text.link};
  text-decoration: underline;
  transition: box-shadow 200ms ${easings.easOut};

  img {
    border: none;
  }

  :focus {
    box-shadow: ${shadows.focus(colors.focus.default)};
  }
`

export const StyledAnimatedButtonGlyph = styled(animated.div)`
  position: absolute;
  left: 0rem;
`

export const StyledAnimatedButtonLabel = styled(animated.span)`
  flex-grow: 1;
`

export const StyledButtonBase = styled.button`
  align-items: center;
  border-radius: 9999px;
  cursor: pointer;
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  font-weight: 500;
  padding: 0 ${props =>
    props.leaveGlyphSpace
      ? props.size === 'small'
        ? '1.25rem'
        : '1.825rem'
      : '1rem'};
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity 200ms ${easings.easeOut}, text-shadow 200ms ${
  easings.easeOut
},
    box-shadow 200ms ${easings.easeOut}, color 200ms ${easings.easeOut};
  white-space: nowrap;

  ${focusRing('::after', { radius: '9999px' })}

  ${props =>
    props.size === 'small'
      ? css`
          font-size: 11px;
          height: 1.5rem;
          line-height: 1.5rem;
        `
      : css`
          font-size: 0.9rem;
          height: 2.5rem;

          ${media.phoneOnly`
            height: 2.25rem
          `}
        `}

  ${props =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.5;
    `}
  
  ${layout};
  ${space};
`

export const StyledIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  align-items: center;
  background-color: transparent;
  cursor: pointer;
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 300ms ${easings.easeOut}, opacity 200ms ${easings.easeOut},
    text-shadow 200ms ${easings.easeOut};
  min-width: 2.5rem;
  min-height: 2.5rem;

  ${props =>
    props.outline &&
    css`
      border: 1px solid ${props.outline};
      border-radius: 9999px;
    `}

  > * {
    position: relative;
  }
  ${focusRing('> *::after', { radius: '9999px', padding: '0.625rem' })}

  ${props =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.5;
    `}

  ${space}
`

export const IconButton = React.forwardRef(
  (
    {
      color = colors.control.icon.default,
      glyph,
      outline,
      size = '1.5rem',
      tooltip,
      tooltipPlacement = 'top',
      ...rest
    },
    ref,
  ) => {
    if (outline && typeof outline !== 'string') {
      outline = color
    }
    let button = (
      <StyledIconButton size={size} ref={ref} {...rest} outline={outline}>
        <Icon color={color} glyph={glyph} size={size} />
      </StyledIconButton>
    )

    if (tooltip) {
      return (
        <Tooltip placement={tooltipPlacement} content={tooltip}>
          {button}
        </Tooltip>
      )
    } else {
      return button
    }
  },
)

export const StyledOutlineButton = styled(StyledButtonBase)`
  background-color: transparent;
  ${props =>
    props.disabled
      ? css`
        box-shadow: 0 0 0 1px ${props.color} inset
        color: ${props.color};
      `
      : css`
          box-shadow: 0 0 0 1px ${props.color} inset,
            0 0 10px ${rgba(props.color, 0.12)},
            0 0 10px ${rgba(props.color, 0.12)} inset;
          color: ${props.color};
          text-shadow: 0 0 5px ${rgba(props.color, 0.1)};

          :active {
            box-shadow: 0 0 0 1px ${props.color} inset,
              0 0 15px ${rgba(props.color, 0.2)},
              0 0 15px ${rgba(props.color, 0.2)} inset;
            text-shadow: 0 0 8px ${rgba(props.color, 0.15)};
          }
        `}
`

export const StyledSolidButton = styled(StyledButtonBase)`
  ${props => css`
    background-color: ${props.color};
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2),
      1px 1px 1px rgba(255, 255, 255, 0.12) inset,
      -1px -1px 1px rgba(0, 0, 0, 0.08) inset;
    color: ${colors.text.light};
    :active {
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
        -1px -1px 1px rgba(255, 255, 255, 0.2) inset,
        1px 1px 1px rgba(0, 0, 0, 0.1) inset;
    }
  `}
`

export const StyledTextButton = styled(StyledButtonBase)`
  ${props => css`
    background-color: transparent;
    color: ${props.color};
    font-weight: 600;
  `}
`

export const Button = React.forwardRef(
  (
    {
      busy,
      children,
      color = colors.ink.black,
      glyph,
      glyphColor,
      spinnerColor,
      inline = false,
      type = 'button',
      outline = false,
      text = false,
      width = undefined,
      ...props
    },
    ref,
  ) => {
    let StyledButton = outline
      ? StyledOutlineButton
      : text
      ? StyledTextButton
      : StyledSolidButton

    if (!glyphColor) {
      glyphColor = outline
        ? rgba(color, 0.85)
        : text
        ? colors.control.icon.default
        : colors.structure.bg
    }
    if (!spinnerColor) {
      spinnerColor = glyphColor
    }
    if (busy) {
      glyph = 'busy'
    }

    let glyphTransitions = useTransition(glyph, null, {
      initial: { t: 1 },
      from: { t: 0 },
      enter: { t: 1 },
      leave: { t: 0 },
    })
    let labelStyleSpring = useSpring({
      to: {
        transform: glyph
          ? 'translateX(' + (props.size === 'small' ? 0.625 : 0.75) + 'rem)'
          : 'translateX(0rem)',
      },
    })

    return (
      <StyledButton
        color={color}
        inline={inline}
        leaveGlyphSpace={busy !== undefined || glyph !== undefined}
        type={type}
        ref={ref}
        outline={outline}
        width={width}
        {...props}>
        {glyphTransitions.map(
          ({ item, props: { t }, key }) =>
            item && (
              <StyledAnimatedButtonGlyph
                key={key}
                style={{
                  transform: t.interpolate(
                    t =>
                      `translateX(${props.size === 'small' ? 0.5 * t : t}rem)`,
                  ),
                  opacity: t,
                }}>
                {item === 'busy' ? (
                  <Spinner
                    color={spinnerColor}
                    backgroundColor={outline ? colors.structure.bg : color}
                    size="1rem"
                    active
                  />
                ) : (
                  <Icon
                    color={glyphColor}
                    display="block"
                    size="1rem"
                    glyph={item}
                  />
                )}
              </StyledAnimatedButtonGlyph>
            ),
        )}
        <StyledAnimatedButtonLabel style={labelStyleSpring}>
          {children}
        </StyledAnimatedButtonLabel>
      </StyledButton>
    )
  },
)
