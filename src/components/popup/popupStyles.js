import React from 'react'
import { animated, interpolate } from 'react-spring/web.cjs'
import styled from 'styled-components/macro'
import Card from 'components/card'
import { colors } from 'theme'

export const PopupArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;

  &::before,
  &::after {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    position: absolute;
  }
  &::before {
    border-width: 8px;
  }
  &::after {
    border-width: 7px;
  }

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -1rem;
    width: 0.5rem;
    height: 0.5rem;
    &::before {
      border-color: transparent transparent ${colors.structure.border}
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent transparent ${colors.structure.bg} transparent;
      z-index: 2;
      margin-left: 1px;
      margin-top: 2px;
    }
  }
  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -0.9em;
    width: 1em;
    height: 0.5em;
    &::before {
      border-width: 0.5em 1em 0 1em;
      border-color: #232323 transparent transparent transparent;
    }
  }
  &[data-placement*='right'] {
    top: 0;
    left: 0;
    margin-top: -0.75rem;
    margin-left: -1rem;
    height: 0.5rem;
    width: 0.5rem;
    &::before {
      border-color: transparent ${colors.structure.border} transparent
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent ${colors.structure.bg} transparent transparent;
      z-index: 2;
      margin-top: 1px;
      margin-left: 2px;
    }
  }
  &[data-placement*='left'] {
    right: 0;
    margin-right: -0.9em;
    height: 3em;
    width: 1em;
    &::before {
      border-width: 1.5em 0 1.5em 1em;
      border-color: transparent transparent transparent#232323;
    }
  }
`

const AnimatedCard = animated(Card)

const StyledPopupBox = styled(AnimatedCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &[data-placement*='bottom'],
  &[data-placement*='top'] {
    margin: 0.5rem 0;
  }
  &[data-placement*='left'],
  &[data-placement*='right'] {
    margin: 0 0.5rem;
  }
  top: 0;
  left: 0;
  z-index: 10;
  transform-origin: top center;
`

export const PopupBox = React.forwardRef(
  (
    {
      transitionProps: { opacity, scale, top: topOffset },
      left,
      top,
      innerRef,
      ...props
    },
    ref,
  ) => (
    <StyledPopupBox
      ref={ref}
      raised
      {...props}
      style={{
        opacity: opacity,
        transform: interpolate(
          [scale, topOffset],
          (scale, topOffset) =>
            `translate3d(${left}px, ${top + topOffset}px, 0) scale(${scale})`,
        ),
        position: props.position,
      }}
    />
  ),
)
