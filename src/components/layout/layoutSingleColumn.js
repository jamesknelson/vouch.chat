import React, { useContext } from 'react'
import styled, { css } from 'styled-components/macro'

import { colors, media, shadows } from 'theme'
import LayoutContext from './layoutContext'

const StyledSingleColumn = styled.div`
  ${media.tabletPlus`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    margin: 0 1rem;

    ${props =>
      props.withBackgroundOnTabletPlus &&
      css`
        background-color: ${colors.structure.bg};
        border-style: solid;
        border-color: ${colors.structure.border};
        border-width: 0 1px;
        box-shadow: ${shadows.card()};
      `}
  `}

  ${media.phoneOnly`
    position: relative;
  `}
`

export function LayoutSingleColumn({
  withBackgroundOnTabletPlus = true,
  ...rest
}) {
  let { footerOverlayHeight } = useContext(LayoutContext)
  return (
    <StyledSingleColumn
      {...rest}
      footerOverlayHeight={footerOverlayHeight}
      withBackgroundOnTabletPlus={withBackgroundOnTabletPlus}
    />
  )
}
