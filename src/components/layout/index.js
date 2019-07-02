import { rgba } from 'polished'
import React, { useState, useRef } from 'react'
import { animated, interpolate, useSpring } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import Tippy from '@tippy.js/react'
import { colors } from 'theme'
import { UserAvatar } from 'components/avatar'
import Icon from 'components/icon'
import { Menu, MenuDivider, MenuLink } from 'components/menu'
import { PopupProvider, PopupTrigger, PopupMenu } from 'components/popup'
import Sidebar from 'components/sidebar'
import { useCurrentUser } from 'context'
import useTrigger from 'hooks/useTrigger'
import {
  NavbarCorner,
  PhoneOnly,
  StyledMain,
  StyledNavbar,
  StyledNavbarIcon,
  StyledNavbarLinkTooltip,
  StyledNavbarLink,
  StyledNavbarWatched,
  StyledWrapper,
  TabletPlus,
  StyledNavbarButton,
} from './styles'
import { Spinner } from 'components/loading'

const UserMenuContent = () => {
  let currentUser = useCurrentUser()
  return currentUser ? (
    <>
      <MenuLink href="/james">Your Profile</MenuLink>
      <MenuDivider />
      <MenuLink href="/account">Account Details</MenuLink>
      <MenuDivider />
      <MenuLink href="/logout">Logout</MenuLink>
    </>
  ) : (
    <>
      <MenuLink href="/login">Sign In </MenuLink>
      <MenuLink href="/join">Join</MenuLink>
    </>
  )
}

const SidebarMoreMenu = ({ children }) => {
  let trigger = useTrigger({
    triggerOnSelect: true,
  })

  return (
    <>
      {children(trigger.ref)}
      <Sidebar open={trigger.active} ref={trigger.popupRef}>
        <Menu onDidSelect={trigger.close}>
          <UserMenuContent />
        </Menu>
      </Sidebar>
    </>
  )
}

const PopupMoreMenu = ({ children }) => {
  return (
    <PopupProvider triggerOnFocus triggerOnSelect>
      <PopupTrigger>{children}</PopupTrigger>
      <PopupMenu placement="right-start">
        <UserMenuContent />
      </PopupMenu>
    </PopupProvider>
  )
}

const NavbarItem = ({ faded, glyph, size, title, ...rest }) => (
  <Tippy
    placement="right"
    touch={false}
    arrow={true}
    arrowType="round"
    content={title}>
    <StyledNavbarLink {...rest} activeClassName={null}>
      <StyledNavbarIcon faded={faded} glyph={glyph} label={title} size={size} />
    </StyledNavbarLink>
  </Tippy>
)

const StyledDisk = styled.span`
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
`
const Disk = props => {
  let lastUserRef = useRef(props.currentUser)
  if (props.currentUser) {
    lastUserRef.current = props.currentUser
  }
  let user = lastUserRef.current

  return (
    <StyledDisk style={{ transform: props.transform }}>
      {user && props.side === 'avatar' ? (
        <UserAvatar user={user} />
      ) : (
        <StyledLogoDisk>
          <Icon
            glyph="brand-letter"
            size="1.75rem"
            css={css`
              color: transparent;
              margin-top: 6px;
              text-shadow: 1px 1px 0px ${colors.structure.bg};
            `}
          />
        </StyledLogoDisk>
      )}
    </StyledDisk>
  )
}
const AnimatedDisk = animated(Disk)

const StyledLogoDisk = styled(StyledDisk)`
  background-color: ${colors.ink.black};
  color: ${colors.structure.wash};
  align-items: center;
  border-radius: 9999px;
  justify-content: center;
`

const StyledCutout = styled.span`
  align-items: center;
  background-color: ${colors.structure.wash};
  border: 1px solid ${colors.structure.border};
  border-radius: 9999px;
  box-shadow: 0 0 2px ${rgba(0, 0, 0, 0.05)} inset,
    0 0 2px 0px ${rgba(0, 0, 0, 0.1)} inset;
  display: flex;
  height: calc(2.5rem + 6px);
  justify-content: center;
  position: relative;
  width: calc(2.5rem + 6px);
`

const BrandAvatarFlipper = props => {
  let config = {
    mass: 1.5,
    tension: 180,
    friction: 16,
  }
  let [flickAngle, setFlickAngle] = useState(0)
  let transitionProps = useSpring({
    config,
    angle: props.currentUser ? Math.PI : 0,
  })
  let flickProps = useSpring({
    config,
    angle: flickAngle,
  })

  return (
    <StyledNavbarLink
      exact
      href={props.currentUser ? '/james' : '/'}
      focusRingSize="2.75rem"
      onTouchStart={() => {
        setFlickAngle(Math.PI / 6)
      }}
      onMouseDown={() => {
        setFlickAngle(Math.PI / 6)
      }}
      onTouchEnd={() => {
        setFlickAngle(0)
      }}
      onMouseUp={() => {
        setFlickAngle(0)
      }}
      css={css`
        align-items: center;
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
      `}>
      <StyledCutout>
        <Icon
          glyph="stamp"
          size="1rem"
          css={css`
            position: absolute;
            color: ${colors.ink.black};
            bottom: -3px;
            right: -3px;
            z-index: 2;
          `}
        />
        <Icon
          glyph="stamp"
          size="1rem"
          css={css`
            position: absolute;
            color: ${colors.structure.bg};
            bottom: -3px;
            right: -3px;
            z-index: 1;
            transform: scale(1.25);

            ::after {
              content: ' ';
              background-color: ${colors.structure.bg};
              border-radius: 999px;
              position: absolute;
              left: 1px;
              right: 2px;
              top: 1px;
              bottom: 2px;
              z-index: 1;
            }
          `}
        />
        <span
          css={css`
            position: absolute;
            color: ${colors.ink.black};
            bottom: -3px;
            font-size: 9px;
            font-weight: 600;
            right: -3px;
            width: 1rem;
            line-height: 1rem;
            text-align: center;
            z-index: 2;
          `}>
          15
        </span>
        <AnimatedDisk
          currentUser={props.currentUser}
          transform={interpolate(
            [transitionProps.angle, flickProps.angle],
            (transitionAngle, flickAngle) =>
              `rotateY(${transitionAngle + flickAngle}rad)`,
          )}
          side={interpolate(
            [transitionProps.angle, flickProps.angle],
            (transitionAngle, flickAngle) => {
              // Which side are we on?
              let front =
                Math.round((transitionAngle + flickAngle) / Math.PI) % 2 === 1

              // Is there an avatar to show?
              let hasAvatar = !!(props.currentUser || transitionAngle > 0)

              return front && hasAvatar ? 'avatar' : 'brand'
            },
          )}
        />
      </StyledCutout>
    </StyledNavbarLink>
  )
}

const Layout = props => {
  let currentUser = useCurrentUser()
  let watched = []

  return (
    <StyledWrapper>
      <StyledNavbar>
        <NavbarCorner>
          <BrandAvatarFlipper currentUser={currentUser} />
        </NavbarCorner>
        <NavbarItem
          href="/watch"
          title="Watch"
          // glyph="binoculars"
          glyph="glasses"
        />
        <NavbarItem
          faded={currentUser === null}
          href="/share"
          title="Share"
          // glyph="bullhorn"
          glyph="pencil"
        />
        <NavbarItem
          faded={currentUser === null}
          href="/messages"
          title="Messages"
          glyph="envelope"
        />
        <NavbarItem
          faded={currentUser === null}
          href="/notifications"
          title="Notifications"
          glyph="bell1"
        />
        <NavbarItem href="/explore" title="Explore" glyph="globe" />
        <TabletPlus>
          <PopupMoreMenu>
            {ref => (
              <StyledNavbarButton title="More" ref={ref}>
                <StyledNavbarIcon glyph="ellipsis" />
              </StyledNavbarButton>
            )}
          </PopupMoreMenu>
        </TabletPlus>
        <PhoneOnly>
          <SidebarMoreMenu>
            {ref => (
              <StyledNavbarButton title="More" ref={ref}>
                <StyledNavbarIcon glyph="ellipsis" />
              </StyledNavbarButton>
            )}
          </SidebarMoreMenu>
        </PhoneOnly>
        <StyledNavbarWatched invisible={!watched || watched.length === 0}>
          {watched.map(
            item => null,
            // TODO:
            // add links for watched people/hashtags
            //<NavbarLink href={item.url} title={item.title}>
            //  <Avatar item={item} />
            //</NavbarLink>
          )}
        </StyledNavbarWatched>
      </StyledNavbar>
      <StyledMain>{props.children}</StyledMain>
    </StyledWrapper>
  )
}

export default Layout
