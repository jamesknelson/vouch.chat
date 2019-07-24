import React, { useContext } from 'react'
import 'styled-components/macro'
import { colors, srOnly, radii } from 'theme'
import Icon from 'components/icon'
import { Spinner } from 'components/loading'
import useControlId from 'hooks/useControlId'
import {
  ControlGroupItemContext,
  ControlGroupRowItemContext,
} from './controlGroup'
import {
  StyledControlBackground,
  StyledControlBorders,
  StyledControlIconLabel,
  StyledControlValidationState,
  StyledControlWrapper,
} from './controlStyles'

export function ControlIconLabel({ glyph, ...props }) {
  return (
    <StyledControlIconLabel {...props}>
      <Icon glyph={glyph} size={'1rem'} />
    </StyledControlIconLabel>
  )
}

export function ControlValidationState({ state, ...props }) {
  return (
    <StyledControlValidationState {...props}>
      {state === 'busy' ? (
        <Spinner
          size="1rem"
          color={colors.ink.light}
          backgroundColor={colors.control.bg.default}
        />
      ) : (
        <Icon
          color={state === 'valid' ? colors.ink.black : colors.ink.mid}
          glyph={state === 'valid' ? 'check' : 'cross2'}
          size="1rem"
        />
      )}
    </StyledControlValidationState>
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
  size,
  style,
  validationState,
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

  if (controlGroupItem && size === undefined) {
    size = 'large'
  }

  let controlStyle = {}

  if (glyph) {
    controlStyle.paddingLeft = '2.25rem'
  }
  if (validationState) {
    controlStyle.paddingRight = '2.25rem'
  }

  return (
    <StyledControlWrapper
      as={as}
      size={size}
      {...props}
      style={{ flex, ...style }}>
      {label && (
        <label htmlFor={controlId} css={srOnly}>
          {label}
        </label>
      )}
      {children({
        id: controlId,
        style: controlStyle,
      })}
      {glyph && (
        <ControlIconLabel htmlFor={controlId} variant={variant} glyph={glyph} />
      )}
      {validationState && <ControlValidationState state={validationState} />}
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
