import { rgba } from 'polished'
import React from 'react'
import { Link } from 'react-navi'
import { animated, useSpring, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'
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
  margin-top: 0.125rem;
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
  padding: 0 ${props => (props.leaveGlyphSpace ? '1.825rem' : '1rem')};
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
    props.width &&
    css`
      width: ${props.width};
    `}

  ${props =>
    props.size === 'small'
      ? css`
          font-size: 0.8rem;
          height: 1.75rem;
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
`

export const StyledIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => css`
    color: ${props.color};
    text-shadow: 0 0 9px ${rgba(props.color, 0.4)},
      0 0 2px ${rgba(props.color, 0.2)};
  `};

  align-items: center;
  background-color: transparent;
  cursor: pointer;
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 300ms ${easings.easeOut}, opacity 200ms ${easings.easeOut},
    text-shadow 200ms ${easings.easeOut};
  min-width: 3rem;
  min-height: 3rem;

  > * {
    position: relative;
  }
  ${focusRing('> *::after', { radius: '9999px', padding: '0.5rem' })}

  ${props =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.5;
    `}
`

export const IconButton = React.forwardRef(
  (
    {
      color = colors.ink.mid,
      glyph,
      size = '1.5rem',
      tooltip,
      tooltipPlacement = 'top',
      ...rest
    },
    ref,
  ) => {
    let button = (
      <StyledIconButton color={color} size={size} ref={ref} {...rest}>
        <Icon glyph={glyph} size={size} />
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
  background-color: ${colors.structure.bg};
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
      width = undefined,
      ...props
    },
    ref,
  ) => {
    let StyledButton = outline ? StyledOutlineButton : StyledSolidButton

    if (!glyphColor) {
      glyphColor = outline ? rgba(color, 0.85) : colors.structure.bg
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
      to: { transform: glyph ? 'translateX(0.75rem)' : 'translateX(0rem)' },
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
                  transform: t.interpolate(t => `translateX(${t}rem)`),
                  opacity: t,
                }}>
                {item === 'busy' ? (
                  <Spinner
                    color={spinnerColor}
                    backgroundColor={outline ? colors.structure.bg : color}
                    size="1.25rem"
                    active
                  />
                ) : (
                  <Icon color={glyphColor} size="1rem" glyph={item} />
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
