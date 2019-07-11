import { rgba } from 'polished'
import React from 'react'
import { Link } from 'react-navi'
import styled, { css } from 'styled-components/macro'

import Icon from 'components/icon'
import Tooltip from 'components/tooltip'
import { useCurrentUser } from 'context'
import { colors, dimensions, easings, media, focusRing } from 'theme'

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

const StyledNavIcon = styled(Icon)`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;

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

const NavLink = React.forwardRef(
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

export const StyledNavLink = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
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

const StyledNavButton = styled.button`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  background-color: transparent;
  border-width: 0;
  cursor: pointer;
  position: relative;
  ${navbarFocusRing};
`

export const NavItem = React.forwardRef(
  (
    {
      faded = false,
      glyph,
      size = '1.5rem',
      tooltip,
      href = undefined,
      ...rest
    },
    ref,
  ) => {
    let icon = <StyledNavIcon faded={faded} glyph={glyph} size={size} />
    let content = href ? (
      <StyledNavLink href={href} ref={ref} {...rest}>
        {icon}
      </StyledNavLink>
    ) : (
      <StyledNavButton {...rest} ref={ref}>
        {icon}
      </StyledNavButton>
    )

    if (tooltip) {
      return (
        <Tooltip content={tooltip} placement="right">
          {content}
        </Tooltip>
      )
    } else {
      return content
    }
  },
)

export const NavItems = () => {
  let currentUser = useCurrentUser()
  return (
    <>
      <NavItem
        href="/read"
        tooltip="Read"
        // unreadCount={4}
        // glyph="binoculars"
        glyph="glasses"
      />
      <NavItem
        faded={currentUser === null}
        href="/share"
        tooltip="Create"
        // glyph="bullhorn"
        glyph="pencil"
      />
      <NavItem
        faded={currentUser === null}
        href="/messages"
        tooltip="Chat"
        glyph="envelope"
      />
      <NavItem
        faded={currentUser === null}
        href="/notifications"
        tooltip="Alerts"
        glyph="bell1"
      />
      {/* <NavItem href="/explore" title="Community" glyph="globe" /> */}
    </>
  )
}
