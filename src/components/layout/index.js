import React from 'react'
import Tippy from '@tippy.js/react'
import { CurrentUserVouchCountWrapper } from 'components/badge'
import { Menu, MenuDivider, MenuLink } from 'components/menu'
import { PopupProvider, PopupTrigger, PopupMenu } from 'components/popup'
import Sidebar from 'components/sidebar'
import { useCurrentUser } from 'context'
import useTrigger from 'hooks/useTrigger'
import {
  NavbarCorner,
  PhoneOnly,
  StyledMain,
  MenuHeader,
  StyledNavbar,
  StyledNavbarIcon,
  StyledNavbarLink,
  StyledNavbarWatched,
  StyledWrapper,
  TabletPlus,
  StyledNavbarButton,
} from './styles'
import BrandAvatarFlipper from './brandAvatarFlipper'

const UserMenuContent = () => {
  let currentUser = useCurrentUser()
  return currentUser ? (
    <>
      <MenuHeader
        displayName="James K Nelson"
        username="james"
        photoURL={currentUser.photoURL}
      />
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
          title="Read"
          // glyph="binoculars"
          glyph="glasses"
        />
        <NavbarItem
          faded={currentUser === null}
          href="/share"
          title="Publish"
          // glyph="bullhorn"
          glyph="pencil"
        />
        <NavbarItem
          faded={currentUser === null}
          href="/messages"
          title="Correspond"
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
                <CurrentUserVouchCountWrapper>
                  <StyledNavbarIcon glyph="ellipsis" />
                </CurrentUserVouchCountWrapper>
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
