import React from 'react'
import styled, { css, keyframes } from 'styled-components/macro'

import { colors } from 'theme'

const loadingBarKeyframes = keyframes`
  0% {
    transform: scaleX(0);
  }
  10% {
    transform: scaleX(0.3);
  }
  50% {
    transform: scaleX(0.7);
  }
  90% {
    transform: scaleX(0.8);
  }
  100% {
    transform: scaleX(1);
  }
`

export const LoadingBar = styled.div`
  height: 2px;
  width: 100%;
  background-color: ${props => props.color || colors.ink.black};
  background-size: 35px 35px;
  z-index: 9999;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) inset;
  transition: transform ease-in 300ms, opacity ease-in 300ms;
  transition-delay: 0;
  transform-origin: left center;
  transform: scaleX(0);
  opacity: 0;
  bottom: 0;

  ${props =>
    props.active &&
    css`
      opacity: 1;

      /**
       * Wait 100ms before showing any loading bar. This should be long enough
       * prevent the display of a loading bar for instant page loads, while
       * short enough to help the user know that something is happening on
       * pages with async data.
       */
      transition-delay: 100ms;

      animation: ${loadingBarKeyframes} 10s ease-out;
      animation-fill-mode: forwards;
    `}
`

const spinnerDashAnimation = keyframes`
  0%,
  10% {
    stroke-dashoffset: 280;
    transform: rotate(0);
  }
  
  50%,
  60% {
    stroke-dashoffset: 75;
    transform: rotate(45deg);
  }
  
  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg);
  }
`

const spinnerRotatorAnimation = keyframes`
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg)
  }
`

// From: https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
export const Spinner = ({
  active = true,
  color = '#aabbcc',
  borderWidth = 2.5,
  position = 'relative',
  size = '100%',
  ...rest
}) => {
  return (
    (active || null) && (
      <svg
        viewBox="0 0 100 100"
        css={css`
          position: ${position};
          background-color: transparent;
          border-radius: 50%;
          display: block;
          width: ${typeof size === 'number' ? size + 'px' : size};
          height: ${typeof size === 'number' ? size + 'px' : size};
          animation: ${spinnerRotatorAnimation} 1.8s linear infinite;
        `}
        {...rest}>
        <circle
          stroke={color}
          strokeWidth={4}
          strokeMiterlimit={1}
          fill="none"
          cx={50}
          cy={50}
          r={48}
          css={css`
            stroke-dasharray: 283;
            stroke-dashoffset: 280;
            transform-origin: 50% 50%;
            animation: ${spinnerDashAnimation} 1.6s ease-in-out infinite both;
          `}
        />
      </svg>
    )
  )
}
