import React from 'react'
import { useCurrentRoute } from 'react-navi'
import Tippy from '@tippy.js/react'
import { LoginButton, RegisterButton } from 'components/button'
import { Menu, MenuDivider, MenuLink } from 'components/menu'
import { PopupProvider, PopupTrigger, PopupMenu } from 'components/popup'
import Sidebar from 'components/sidebar'
import { useCurrentUser } from 'context'
import useLastScrollDirection from 'hooks/useLastScrollDirection'
import useTrigger from 'hooks/useTrigger'
import {
  FlexPhoneOnly,
  FlexTabletPlus,
  HeaderBrandTextLink,
  NavbarCorner,
  MenuHeader,
  PhoneWrapper,
  StyledHeaderActions,
  StyledHeaderTitle,
  StyledMain,
  StyledNavbarButton,
  StyledNavbarIcon,
  StyledNavbarLink,
  StyledNavbarWatched,
  StyledPhoneNavbar,
  StyledPhoneHeaderOverlay,
  StyledTabletPlusHeader,
  StyledTabletPlusNavbar,
  TabletPlusWrapper,
} from './styles'
import BrandAvatarFlipper from './brandAvatarFlipper'

const UserMenuContent = () => {
  let currentUser = useCurrentUser()

  if (currentUser === undefined) {
    return null
  }

  return currentUser ? (
    <>
      <MenuHeader
        displayName="James K Nelson"
        username="james"
        photoURL={currentUser.photoURL}
      />
      <MenuDivider />
      <MenuLink href="/account">Settings</MenuLink>
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
      <Sidebar
        open={trigger.active}
        ref={trigger.popupRef}
        onClose={trigger.close}>
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

const NavbarItem = ({ faded, glyph, size, title, media, ...rest }) => {
  let icon = (
    <StyledNavbarLink {...rest}>
      <StyledNavbarIcon faded={faded} glyph={glyph} label={title} size={size} />
    </StyledNavbarLink>
  )

  return (
    <>
      <FlexTabletPlus>
        <Tippy
          placement="right"
          touch={false}
          arrow={true}
          arrowType="round"
          content={title}>
          {icon}
        </Tippy>
      </FlexTabletPlus>
      <FlexPhoneOnly>{icon}</FlexPhoneOnly>
    </>
  )
}

const NavbarItems = () => {
  let currentUser = useCurrentUser()
  return (
    <>
      <NavbarItem
        href="/watch"
        title="Read"
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
        title="Chat"
        glyph="envelope"
      />
      <NavbarItem
        faded={currentUser === null}
        href="/notifications"
        title="Alerts"
        glyph="bell1"
      />
      <NavbarItem href="/explore" title="Community" glyph="globe" />
    </>
  )
}

const Layout = props => {
  let currentRoute = useCurrentRoute()
  let currentUser = useCurrentUser()
  let lastScrollDirection = useLastScrollDirection()

  let hideNavbar = currentRoute.data.auth
  let hideTitle =
    !hideNavbar && lastScrollDirection && lastScrollDirection === 'down'

  let watched = []

  return (
    <>
      <PhoneWrapper>
        <PhoneHeaderOverlay hide={hideTitle} relative={hideNavbar} />
        <StyledPhoneNavbar leaveTitleSpace={!hideTitle} hide={hideNavbar}>
          <NavbarItems />
          <SidebarMoreMenu>
            {ref => (
              <StyledNavbarButton title="More" ref={ref}>
                <StyledNavbarIcon glyph="ellipsis" />
              </StyledNavbarButton>
            )}
          </SidebarMoreMenu>
        </StyledPhoneNavbar>
        <StyledMain>{props.children}</StyledMain>
      </PhoneWrapper>
      <TabletPlusWrapper>
        <StyledTabletPlusNavbar>
          <NavbarCorner>
            <BrandAvatarFlipper currentUser={currentUser} />
          </NavbarCorner>
          <NavbarItems />
          <PopupMoreMenu>
            {ref => (
              <StyledNavbarButton title="More" ref={ref}>
                <StyledNavbarIcon glyph="ellipsis" />
              </StyledNavbarButton>
            )}
          </PopupMoreMenu>
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
        </StyledTabletPlusNavbar>
        <StyledMain>{props.children}</StyledMain>
      </TabletPlusWrapper>
    </>
  )
}

const PhoneHeaderOverlay = ({ hide, relative }) => {
  let currentUser = useCurrentUser()
  let {
    title,
    data: { auth, headerActions, indexHeaderActions },
    url,
  } = useCurrentRoute()
  let actions
  if (currentUser !== undefined) {
    if (!currentUser) {
      actions = !/^\/login/.test(url.pathname) ? (
        <LoginButton />
      ) : (
        <RegisterButton />
      )
    } else {
      actions = headerActions || indexHeaderActions
    }
  }

  return (
    <StyledPhoneHeaderOverlay hide={hide} relative={relative}>
      <FlexPhoneOnly
        style={{
          flex: '0',
          marginRight: '0.75rem',
        }}>
        <BrandAvatarFlipper currentUser={currentUser} sizeRem="2.75" />
      </FlexPhoneOnly>
      {auth || !title ? (
        <HeaderBrandTextLink />
      ) : (
        <StyledHeaderTitle>{title}</StyledHeaderTitle>
      )}
      <StyledHeaderActions>{actions}</StyledHeaderActions>
    </StyledPhoneHeaderOverlay>
  )
}

export const Header = ({ children, title, ...rest }) => {
  let currentUser = useCurrentUser()
  let { data, url } = useCurrentRoute()

  let defaultActions =
    data.auth &&
    (!/^\/login/.test(url.pathname) ? <LoginButton /> : <RegisterButton />)

  return (
    <StyledTabletPlusHeader {...rest}>
      {title && <StyledHeaderTitle>{title}</StyledHeaderTitle>}
      <StyledHeaderActions>
        {currentUser ? children : defaultActions}
      </StyledHeaderActions>
    </StyledTabletPlusHeader>
  )
}

export default Layout
