import { rgba } from 'polished'
import styled, { css } from 'styled-components/macro'
import { colors, easings, shadows } from 'theme'

export const StyledControlWrapper = styled.span`
  align-items: center;
  position: relative;
  display: flex;
  padding: ${props => (props.size === 'large' ? '0.25rem' : 0)};

  > * {
    z-index: 6;
  }

  > :focus,
  > :focus ~ * {
    z-index: 8;
  }
`

export const StyledControlIconLabel = styled.label`
  transition: color 200ms ${easings.easeOut};

  color: ${props =>
    colors.control.icon[props.variant] || colors.control.icon['default']};
  display: flex;
  text-shadow: 0 0 3px
    ${props =>
      rgba(
        colors.control.icon[props.variant] || colors.control.icon['default'],
        0.1,
      )};
  position: absolute;
  left: 0;
  z-index: 9;
  padding: 0 0.75rem;
  text-align: right;
`

export const StyledControlValidationState = styled.span`
  position: absolute;
  right: 0.5rem;
`

export const StyledControlBackground = styled.div`
  ${props => css`
    border-top-left-radius: ${props.topLeft};
    border-top-right-radius: ${props.topRight};
    border-bottom-right-radius: ${props.bottomRight};
    border-bottom-left-radius: ${props.bottomLeft};

    background-color: ${props.backgroundColor};
  `}

  transition: background-color 200ms ${easings.easeOut};

  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.03) inset;
  width: 100%;
  display: block;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;

  *:focus ~ & {
    z-index: 5;
  }

  &::placeholder,
  &::-webkit-input-placeholder,
  &:-moz-placeholder,
  &:-ms-input-placeholder {
    color: ${colors.text.placeholder};
  }
`

// This can be referenced when the input is focused by using the CSS `~`
// sibling selector, allowing for a focus ring to be added that is
// positioned with the group, as opposed to the individual input.
// However, it is stacked underneath the control itself to avoid blocking
// input.
export const StyledControlBorders = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;

  transition: border 200ms ${easings.easeOut};

  ${props => css`
    border: 1px solid ${props.color};

    border-top-left-radius: ${props.topLeft};
    border-top-right-radius: ${props.topRight};
    border-bottom-right-radius: ${props.bottomRight};
    border-bottom-left-radius: ${props.bottomLeft};

    z-index: ${props.priority ? 2 : 1};
  `}

  * ~ &::after {
    content: ' ';
    transition: box-shadow 200ms ${easings.easeOut};
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: ${props => props.radius};
    position: absolute;
    display: block;
  }
  *:hover ~ & {
    z-index: 5;

    ::after {
      box-shadow: ${shadows.focus(colors.ink.light)};
    }
  }
  *:focus ~ & {
    z-index: 7;

    ::after {
      box-shadow: ${shadows.focus(colors.focus.default)};
    }
  }
`

export const StyledControlGroupDivider = styled.div`
  height: 1px;
  width: 100%;
  display: block;
`

export const StyledControlGroupRowDivider = styled.div`
  flex: 1px 0 0;
`
