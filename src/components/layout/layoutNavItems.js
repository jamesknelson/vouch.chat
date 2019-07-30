import { rgba } from 'polished'
import React from 'react'
import { useActive, useLinkProps } from 'react-navi'
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
  filter: drop-shadow(
    0px 0px 9px
      ${props => rgba(props.faded ? colors.ink.light : colors.ink.black, 0.3)}
  );
  line-height: 1.5rem;
  position: relative;
  transition: color 500ms ${easings.easeOut};

  ${media.phoneOnly`
    padding: 0 0.25rem;
    margin: 0 0.25rem;
  `}
  ${media.tabletPlus`
    width: ${dimensions.bar};
    margin: 0.75rem 0;
  `}
`

const StyledNavLinkIndicator = styled.span`
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

  ${props =>
    props.active &&
    css`
      ::before {
        background-color: ${rgba(colors.ink.black, 0.75)};
        box-shadow: 0 0 7px 2px ${rgba(colors.ink.black, 0.12)};
      }
    `}
`

const StyledNavLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  ${navbarFocusRing};
`

export const NavLink = React.forwardRef(
  ({ active, children, hideActiveIndicator, ...rest }, ref) => {
    let linkProps = useLinkProps(rest)
    let activeFromHook = useActive(rest.href, {
      exact: true,
      loading: true,
    })

    if (active === undefined) {
      active = activeFromHook
    }

    return (
      <StyledNavLink {...linkProps} ref={ref}>
        {children}
        {!hideActiveIndicator && <StyledNavLinkIndicator active={active} />}
      </StyledNavLink>
    )
  },
)

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
      active,
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
      <NavLink active={active} href={href} ref={ref} {...rest}>
        {icon}
      </NavLink>
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
  let isDisabled = currentUser && !currentUser.username

  let isReadActive = useActive('/', {
    exact: true,
    loading: true,
  })
  let isRecentActive = useActive('/recent', {
    exact: true,
    loading: true,
  })

  return (
    <>
      <NavItem
        faded={isDisabled}
        active={isReadActive || isRecentActive}
        href="/"
        tooltip="Read"
        // unreadCount={4}
        // glyph="binoculars"
        glyph="glasses"
      />
      <NavItem
        faded={isDisabled || currentUser === null}
        href="/log"
        tooltip="Log"
        glyph="edit"
      />
      {/* <NavItem
        faded={isDisabled || currentUser === null}
        href="/messages"
        tooltip="Chat"
        glyph="mail"
      /> */}
      {/* <NavItem
        faded={isDisabled || currentUser === null}
        href="/notifications"
        tooltip="Alerts"
        glyph="bell1"
      /> */}
      {/* <NavItem href="/explore" title="Community" glyph="globe" /> */}
    </>
  )
}
