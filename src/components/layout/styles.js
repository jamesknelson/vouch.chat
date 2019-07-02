import { rgba } from 'polished'
import React from 'react'
import { Link } from 'react-navi'
import styled, { css } from 'styled-components/macro'
import { colors, dimensions, easings, focusRing, media, shadows } from 'theme'
import { BrandImage } from 'components/brand'
import Icon from 'components/icon'

export const TabletPlus = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;

  ${media.phoneOnly`
    display: none;
  `}
`
export const PhoneOnly = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;

  ${media.tabletPlus`
    display: none;
  `}
`

export const StyledWrapper = styled.div`
  height: 100%;
  min-height: 100%;
`

export const StyledNavbar = styled.nav`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  position: fixed;
  top: 0;
  z-index: 3;

  ${media.phoneOnly`
    border-bottom: 1px solid ${colors.structure.border};
    display: flex;
    justify-content: stretch;
    height: ${dimensions.bar};
    width: 100%;
  `}
  ${media.tabletPlus`
    border-right: 1px solid ${colors.structure.border};
    height: 100%;
    width: ${dimensions.bar};
  `}
`

export const NavbarCorner = styled.div`
  align-items: center;
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.divider};
  color: ${colors.ink.black};
  display: flex;
  height: ${dimensions.bar};
  justify-content: center;
  left: 0;
  margin-bottom: 1rem;
  top: 0;
  z-index: 100;

  ${media.phoneOnly`
    display: none;
  `}
`

export const StyledNavbarIcon = styled(Icon)`
  align-items: center;
  color: ${props => (props.faded ? colors.ink.light : colors.ink.black)};
  text-shadow: 0 0 9px
      ${props => rgba(props.faded ? colors.ink.light : colors.ink.black, 0.4)},
    0 0 2px
      ${props => rgba(props.faded ? colors.ink.light : colors.ink.black, 0.2)};
  display: flex;
  line-height: 1.5rem;
  justify-content: center;
  position: relative;
  transition: color 500ms ${easings.easeOut};

  ${media.phoneOnly`
    padding: 0 0.25rem;
    margin: 0 0.25rem;
  `}
  ${media.tabletPlus`
    width: ${dimensions.bar};
    padding: 1rem 0;
    margin: 0.325rem 0;
  `}
`

StyledNavbarIcon.defaultProps = {
  size: '1.5rem',
}

const NavbarLink = React.forwardRef(
  ({ children, faded, glyph, ...rest }, ref) => (
    <Link {...rest} activeClassName="NavbarLink-active" ref={ref}>
      {children}
      <span className="NavbarLink-activeIndicator" />
    </Link>
  ),
)

const navbarFocusRing = css`
  ${focusRing('::after', { radius: '9999px' })}
  ::after {
    ${({ focusRingSize = '2.5rem' }) => css`
      height: ${focusRingSize};
      width: ${focusRingSize};
      left: calc(50% - ${focusRingSize} / 2);
      top: calc(50% - ${focusRingSize} / 2);
    `}
  }
`

export const StyledNavbarLink = styled(NavbarLink)`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  ${navbarFocusRing};

  ${media.phoneOnly`
    flex: 1;
  `}

  .NavbarLink-activeIndicator {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    ::before {
      position: absolute;
      content: ' ';
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: transparent;
      transition: background-color 200ms ${easings.easeOut};

      ${media.phoneOnly`
        left: calc(50% - 1px);
        bottom: -2px;
      `}
      ${media.tabletPlus`
        top: calc(50% - 1px);
        right: -2px;
      `}
    }
  }

  &.NavbarLink-active {
    .NavbarLink-activeIndicator::before {
      background-color: ${rgba(colors.ink.black, 0.75)};
      box-shadow: 0 0 7px 2px ${rgba(colors.ink.black, 0.12)};
    }
  }
`

export const StyledNavbarButton = styled.button`
  align-items: center;
  background-color: transparent;
  border-width: 0;
  cursor: pointer;
  display: flex;
  flex: 1;
  justify-content: center;
  position: relative;
  ${navbarFocusRing};
`

export const StyledNavbarWatched = styled.div`
  border-bottom: 1px solid ${colors.structure.divider};
  border-top: 1px solid ${colors.structure.divider};
  opacity: ${props => (props.invisible ? 0 : 1)};
  transition: opacity 200ms ${easings.easeOut};

  ${media.phoneOnly`
    display: none;
  `}
`

export const StyledHeader = styled.header`
  align-items: center;
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  display: flex;
  height: ${dimensions.bar};
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 10;

  left: 0;
  padding: 1rem 0 1rem 0;
  width: 100%;
  ${media.tabletPlus`
    border-bottom: 1px solid ${colors.structure.border};
    left: ${dimensions.bar};
    padding: 1rem;
    width: calc(100% - ${dimensions.bar});
  `}
`

export const HeaderBrandTextLink = () => (
  <Link
    css={css`
      display: flex;
      flex: 1;

      ${focusRing('::after')}
    `}>
    <BrandImage />
  </Link>
)

export const HeaderBrandLogoLink = styled(Link)``

export const StyledHeaderBackButton = styled(Link)``

export const StyledHeaderTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  margin-left: 0.5rem;
`

export const StyledMain = styled.main`
  ${media.phoneOnly`
    ${StyledNavbar} ~ & {
      padding-top: calc(${dimensions.bar});
    }
  `}
  ${media.tabletPlus`
    padding-left: ${dimensions.bar};
  `}
`
