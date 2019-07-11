import React, { useContext } from 'react'
import 'styled-components/macro'
import { colors, srOnly, radii } from 'theme'
import Icon from 'components/icon'
import useControlId from 'hooks/useControlId'
import {
  ControlGroupItemContext,
  ControlGroupRowItemContext,
} from './controlGroup'
import {
  StyledControlBackground,
  StyledControlBorders,
  StyledControlIconLabel,
  StyledControlWrapper,
} from './styles'

export function ControlIconLabel({ glyph, ...props }) {
  return (
    <StyledControlIconLabel {...props}>
      <Icon glyph={glyph} size={'1rem'} />
    </StyledControlIconLabel>
  )
}

export function Control({
  as,
  children,
  glyph,
  id,
  label,
  radius,
  variant,
  style,
  ...props
}) {
  radius = radii[radius] || radius || radii.small

  let controlId = useControlId(id)
  let controlGroupItem = useContext(ControlGroupItemContext)
  let firstRow = !controlGroupItem || controlGroupItem.firstRow
  let lastRow = !controlGroupItem || controlGroupItem.lastRow
  let { firstColumn, lastColumn, flex } = useContext(ControlGroupRowItemContext)
  let bg = colors.control.bg[variant] || colors.control.bg['default']
  let border =
    colors.control.border[variant] || colors.control.border['default']
  let corners = {
    topLeft: firstRow && firstColumn ? radius : 0,
    topRight: firstRow && lastColumn ? radius : 0,
    bottomRight: lastRow && lastColumn ? radius : 0,
    bottomLeft: lastRow && firstColumn ? radius : 0,
  }

  return (
    <StyledControlWrapper as={as} {...props} style={{ flex, ...style }}>
      {label && (
        <label htmlFor={controlId} css={srOnly}>
          {label}
        </label>
      )}
      {children(controlId)}
      {glyph && (
        <ControlIconLabel htmlFor={controlId} variant={variant} glyph={glyph} />
      )}
      <StyledControlBackground backgroundColor={bg} {...corners} />
      <StyledControlBorders
        radius={radius}
        color={border}
        priority={!!variant}
        {...corners}
      />
    </StyledControlWrapper>
  )
}

export default Control
