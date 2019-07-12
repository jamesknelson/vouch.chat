import React, { useContext } from 'react'
import { Link, useNavigation } from 'react-navi'
import styled, { css } from 'styled-components/macro'

import { BrandImage } from 'components/brand'
import { dimensions, focusRing } from 'theme'
import LayoutContext from './layoutContext'
import { NavItem } from './layoutNavItems'

const StyledHeaderTitle = styled.h1`
  flex: 1;
  font-size: 1.2rem;
  font-weight: 700;

  :first-child {
    padding-left: 1rem;
  }
`

const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${dimensions.bar};
  width: 100%;
`

const HeaderBrandTextLink = () => (
  <div
    css={css`
      /* Insert a flex box to keep other header items aligned */
      flex: 1;

      :first-child {
        padding-left: 1rem;
      }
    `}>
    <Link
      href="/"
      css={css`
        position: relative;
        display: flex;
        flex: 0;

        ${focusRing('::after')}
      `}>
      <BrandImage
        css={css`
          height: 1rem;
        `}
      />
    </Link>
  </div>
)

export const LayoutHeaderContent = ({
  children,
  index = undefined,
  left = undefined,
  showBack = undefined,
  ...rest
}) => {
  let {
    indexHeaderActions,
    indexHeaderTitle,
    headerActions,
    headerTitle,
    minimal,
  } = useContext(LayoutContext)
  let navigation = useNavigation()

  let title = (index ? indexHeaderTitle : headerTitle) || null
  let actions = children || (index ? indexHeaderActions : headerActions)

  if (minimal) {
    title = <HeaderBrandTextLink />
  }

  if (showBack) {
    left = (
      <NavItem
        hideActiveIndicator
        onClick={() => navigation.goBack()}
        glyph="chevron-left"
        tooltip="Back"
        css={css`
          flex: 0;
          margin-right: 0.75rem;
        `}
      />
    )
  }

  return (
    <StyledHeaderContent {...rest}>
      {left || null}
      {React.isValidElement(title)
        ? title
        : title && <StyledHeaderTitle>{title}</StyledHeaderTitle>}
      <StyledHeaderActions>
        {actions || (
          <div
            css={css`
              margin-left: 1rem;
            `}
          />
        )}
      </StyledHeaderActions>
    </StyledHeaderContent>
  )
}
