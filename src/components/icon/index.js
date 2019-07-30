import React from 'react'
import styled, { css } from 'styled-components/macro'

import { colors } from 'theme'
import addDefaultRemUnits from 'utils/addDefaultRemUnits'

const requireIcon = name =>
  require('@svgr/webpack?-svgo,+titleProp,+ref[path]!./icomoon/SVG/' +
    name +
    '.svg')

const DEFAULT_ICON_SIZE = '2rem'

const StyledIconContainer = styled.div`
  display: ${props => props.display};
  height: ${props => props.size};
  width: ${props => props.size};
  text-align: center;
`

const StyledIcon = styled.div`
  display: block;
  margin: 0 auto;
  height: ${props => props.size};
  width: ${props => props.size};

  ${props =>
    props.color &&
    css`
      fill: ${props.color};
    `}
`

const Icon = React.forwardRef(
  (
    {
      display = 'inline-block',
      glyph,
      label,
      size = DEFAULT_ICON_SIZE,
      color = colors.control.icon.default,
      ...props
    },
    ref,
  ) => {
    size = addDefaultRemUnits(size)

    let IconComponent
    try {
      IconComponent = requireIcon(glyph).ReactComponent
    } catch (e) {}

    if (!IconComponent) {
      console.error('Missing icon: ' + glyph)
      return (
        <div
          css={css`
            display: inline-block;
            height: ${size};
            width: ${size};
          `}
        />
      )
    }

    return (
      <StyledIconContainer display={display} {...props}>
        <StyledIcon
          size={size}
          color={color}
          as={IconComponent}
          ref={ref}
          role="img"
          title={label}
          aria-label={label}
        />
      </StyledIconContainer>
    )
  },
)

export default Icon
