import { rgba } from 'polished'
import React from 'react'
import { Link } from 'react-navi'
import styled, { css } from 'styled-components/macro'
import { colors, dimensions, easings, focusRing, media, shadows } from 'theme'
import { Avatar } from 'components/avatar'
import { BrandImage } from 'components/brand'
import Icon from 'components/icon'
import { PhoneOnly, TabletPlus, phoneOnly, tabletPlus } from 'components/media'
import { MenuLink } from 'components/menu'

// A helper for defining flexbox attributes
const flex = (justify, align, flex) => css`
  display: flex;

  ${align && `align-items: ${align};`}
  ${flex && `flex: ${flex};`}
  ${justify && `justify-content: ${justify};`}
`

export const FlexPhoneOnly = styled(PhoneOnly)`
  ${flex('center', 'stretch', 1)}
`
export const FlexTabletPlus = styled(TabletPlus)`
  ${flex('center', 'stretch', 1)}
`

export const MenuHeader = ({ displayName, username, photoURL }) => (
  <MenuLink
    href={`/${username}`}
    css={css`
      align-items: center;
      justify-content: space-between;
      display: flex;
    `}>
    <div>
      <h4
        css={css`
          color: ${colors.text.default};
          font-weight: 800;
          font-size: 1rem;
          padding-right: 1rem;

          ${media.phoneOnly`
            /* Allow standard line breaks on mobile as the menu
               will appear in a sidebar instead of a popup */
            white-space: normal;
          `}
        `}>
        {displayName}
      </h4>
      <p
        css={css`
          color: ${colors.text.tertiary};
          font-size: 0.8rem;
        `}>
        @{username}
      </p>
    </div>
    <Avatar
      photoURL={photoURL}
      css={css`
        flex-grow: 0;
        flex-shrink: 0;
      `}
    />
  </MenuLink>
)

const StyledWrapper = styled.div`
  height: 100%;
  min-height: 100%;
`
export const PhoneWrapper = phoneOnly(StyledWrapper)
export const TabletPlusWrapper = tabletPlus(StyledWrapper)

export const StyledPhoneHeaderOverlay = styled.header`
  ${flex('space-between', 'center')}

  height: ${dimensions.bar};
  width: 100%;
  position: ${props => (props.relative ? 'relative' : 'fixed')};
  top: 0;
  z-index: 10;
  left: 0;
  padding: 0 1rem 0 0.75rem;
  transition: transform 200ms ${easings.easeOut};
  transform: translateY(${props => (props.hide ? `-${dimensions.bar}` : 0)});
`

export const StyledPhoneNavbar = styled.nav`
  ${flex('space-between', 'stretch')}

  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  border-bottom: 1px solid ${colors.structure.border};

  position: fixed;
  top: 0;
  width: 100%;
  height: calc(${dimensions.bar} * 7 / 4);
  z-index: 3;

  transition: transform 200ms ${easings.easeInOut};
  transform: translateY(
    ${props =>
      props.hide
        ? `calc(-${dimensions.bar} * 7 / 4)`
        : props.leaveTitleSpace
        ? 0
        : `-${dimensions.bar}`}
  );

  padding: ${dimensions.bar} 0.5rem 0;
  ${media.mediumPhonePlus`
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  `}
`

export const StyledTabletPlusNavbar = styled.nav`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  position: fixed;
  top: 0;
  z-index: 3;
  bottom: 0;
  left: 0;
  border-right: 1px solid ${colors.structure.border};
  width: ${dimensions.bar};
  height: 100%;
`

export const NavbarCorner = styled(TabletPlus)`
  ${flex('center', 'center', 1)}
  position: relative;
  border-bottom: 1px solid ${colors.structure.divider};
  color: ${colors.ink.black};
  height: ${dimensions.bar};
  left: 0;
  margin-bottom: 1rem;
  top: 0;
  width: 100%;
  z-index: 100;
`

export const StyledNavbarIcon = styled(Icon)`
  ${flex('center', 'center', 1)}
  color: ${props => (props.faded ? colors.ink.light : colors.ink.black)};
  text-shadow: 0 0 9px
      ${props => rgba(props.faded ? colors.ink.light : colors.ink.black, 0.4)},
    0 0 2px
      ${props => rgba(props.faded ? colors.ink.light : colors.ink.black, 0.2)};
  line-height: 1.5rem;
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
  (
    { children, faded, focusRingSize, glyph, hideActiveIndicator, ...rest },
    ref,
  ) => (
    <Link activeClassName="NavbarLink-active" {...rest} ref={ref}>
      {children}
      {!hideActiveIndicator && <span className="NavbarLink-activeIndicator" />}
    </Link>
  ),
)

const navbarFocusRing = css`
  ${focusRing('::after', { radius: '9999px' })}
  ::after {
    ${({ focusRingSize = '2.25rem' }) => css`
      height: ${focusRingSize};
      width: ${focusRingSize};
      left: calc(50% - ${focusRingSize} / 2);
      top: calc(50% - ${focusRingSize} / 2);
    `}
  }
`

export const StyledNavbarLink = styled(NavbarLink)`
  position: relative;
  ${flex('center', 'center', 1)}
  ${navbarFocusRing};

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
  ${flex('center', 'center', 1)}
  background-color: transparent;
  border-width: 0;
  cursor: pointer;
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

export const StyledTabletPlusHeader = styled(TabletPlus)`
  ${flex('space-between', 'center')}
  height: ${dimensions.bar};
  width: 100%;
  padding: 1rem;
`

export const StyledHeaderBackButton = styled(Link)``

export const HeaderBrandTextLink = () => (
  <div
    css={css`
      /* Insert a flex box to keep other header items aligned */
      flex: 1;
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

export const StyledHeaderTitle = styled.h1`
  flex: 1;
  font-size: 1.2rem;
  font-weight: 700;
`

export const StyledHeaderActions = styled.div`
  ${flex('flex-end', 'center', 1)}
`

export const StyledMain = styled.main`
  ${media.phoneOnly`
    padding-top: calc(${dimensions.bar} * 7 / 4);
  `}
  ${media.tabletPlus`
    padding-left: ${dimensions.bar};
  `}
`
