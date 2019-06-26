import { rgba } from 'polished'
import React from 'react'
import { Link, useCurrentRoute } from 'react-navi'
import { animated, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import Tippy from '@tippy.js/react'
import { colors, dimensions, easings, focusRing, media, shadows } from 'theme'
import { UserAvatar } from 'components/avatar'
import { AuthButtonLink, ButtonLink } from 'components/button'
import Card from 'components/card'
import Icon from 'components/icon'
import { Menu, MenuDivider, MenuLink } from 'components/menu'
import SearchInput from 'components/searchInput'
import {
  PopupContext,
  PopupProvider,
  PopupTrigger,
  PopupMenu,
} from 'components/popup'
import { useCurrentUser } from 'context'
import useTrigger from 'hooks/useTrigger'

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
`

const Header = styled.header`
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

const Navbar = styled.nav`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  position: fixed;
  top: ${dimensions.bar};
  z-index: 3;

  ${media.phoneOnly`
    border-bottom: 1px solid ${colors.structure.border};
    display: flex;
    justify-content: stretch;
    height: ${dimensions.bar};
    top: ${dimensions.bar};
    width: 100%;
  `}
  ${media.tabletPlus`
    border-right: 1px solid ${colors.structure.border};
    height: calc(100% - ${dimensions.bar});
    padding-top: 0.75rem;
    width: ${dimensions.bar};
  `}
`

const Main = styled.main`
  ${media.phoneOnly`
    padding-top: calc(${dimensions.bar} * 2);
  `}
  ${media.tabletPlus`
    padding-left: ${dimensions.bar};
    padding-top: ${dimensions.bar};
  `}
`

const HomeLink = styled(Link)`
  align-items: center;
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.divider};
  border-right: 1px solid ${colors.structure.divider};
  color: ${colors.ink.black};
  display: flex;
  height: ${dimensions.bar};
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: ${dimensions.bar};
  z-index: 100;

  ${focusRing('::before', { padding: '-0.6rem', radius: '9999px' })}
`

const StyledNavLink = styled(Link)`
  align-items: center;
  color: ${colors.ink.black};
  display: flex;
  justify-content: center;
  position: relative;
  transition: text-shadow 200ms ${easings.easeOut};

  ${media.phoneOnly`
    flex: 1;
    padding: 0 0.25rem;
    margin: 0 0.25rem;
  `}
  ${media.tabletPlus`
    width: ${dimensions.bar};
    padding: 0.5rem 0;
    margin: 0.5rem 0;
  `}

  ::after {
    content: ' ';
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: ${rgba(colors.ink.black, 0)};
    box-shadow: 0 0 0 0 ${rgba(colors.ink.black, 0)};
    transition: background-color 200ms ${easings.easeOut},
      box-shadow 200ms ${easings.easeOut};

    ${media.tabletPlus`
      top: 0;
      width: 1px;
    `}
    ${media.phoneOnly`
      left: 0;
      height: 1px;
    `}
  }

  &.NavLink-active {
    color: ${colors.ink.black};

    ::after {
      background-color: ${rgba(colors.ink.black, 0.15)};
      box-shadow: 0 0 2px 1px ${rgba(colors.ink.black, 0.08)};
    }
  }

  :focus::after {
    background-color: ${colors.focus.default};
    box-shadow: ${shadows.focusSoft()};

    ${media.tabletPlus`
      width: 2px;
    `}
    ${media.phoneOnly`
      height: 2px;
    `}
  }

  :hover {
    text-shadow: 0 0 0.5rem ${rgba(colors.focus.default, 0.6)};
  }

  :focus {
    text-shadow: 0 0 0.75rem ${rgba(colors.focus.default, 0.8)};
  }
`

const NavLinkTooltip = styled.span`
  ${media.phoneOnly`
    font-size: 0.9rem;
    font-weight: 600;
  `}
`

const NavLink = ({ title, ...props }) => (
  <Tippy
    placement="right"
    touch={false}
    arrow={true}
    arrowType="round"
    content={<NavLinkTooltip>{title}</NavLinkTooltip>}>
    <StyledNavLink {...props} activeClassName="NavLink-active" />
  </Tippy>
)

const AvailableStampsIndicator = ({ highlight, count, ...props }) => (
  <Link
    href="/plans"
    css={css`
      color: ${colors.ink.black};
      display: flex;
      align-items: center;
      margin: 0 1rem;
      position: relative;
      ${focusRing('::after', { padding: '2px 0.5rem', radius: '9999px' })}
    `}>
    <Icon glyph="vouch" size="1rem" />
    <span
      css={css`
        font-size: 1rem;
        font-weight: 800;
        margin-left: 0.25rem;
      `}>
      {count}
    </span>
  </Link>
)

const UserDropdown = () => {
  return (
    <PopupProvider triggerOnFocus triggerOnSelect>
      <PopupTrigger>
        {ref => (
          <UserAvatar
            ref={ref}
            tabIndex={0}
            css={css`
              cursor: pointer;
              margin-right: 1rem;
            `}
          />
        )}
      </PopupTrigger>
      <PopupMenu placement="bottom-end">
        <UserMenuContent />
      </PopupMenu>
    </PopupProvider>
  )
}

const UserMenuContent = () => (
  <>
    <MenuLink href="/james">Your Profile</MenuLink>
    <MenuDivider />
    <MenuLink href="/account">Account Details</MenuLink>
    <MenuDivider />
    <MenuLink href="/logout">Logout</MenuLink>
  </>
)

const AnimatedMenu = animated(Menu)

const StyledUserSidebar = styled(animated(Card))`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 70%;
  max-width: 250px;
  z-index: 99;
`

const StyledSidebarBackdrop = styled(animated.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
`

const UserSidebar = () => {
  let currentUser = useCurrentUser()

  let trigger = useTrigger({
    triggerOnSelect: true,
  })

  let transitions = useTransition(trigger.active, null, {
    config: { tension: 300, mass: 0.5 },
    from: { opacity: 0, transform: 'translateX(-100%)' },
    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: { opacity: 0, transform: 'translateX(-100%)' },
  })

  return (
    <PopupContext.Provider value={{ trigger }}>
      <div
        ref={trigger.ref}
        tabIndex={0}
        css={css`
          align-items: center;
          cursor: pointer;
          display: flex;
          height: ${dimensions.bar};
          justify-content: center;
          left: 0;
          position: relative;
          width: ${dimensions.bar};

          ${focusRing('::before', { padding: '-0.75rem', radius: '9999px' })}
        `}>
        {currentUser ? <UserAvatar /> : <Icon glyph="menu" size="1.5rem" />}
      </div>
      {transitions.map(
        ({ item, props: { opacity, transform }, key, state }) =>
          item && (
            <React.Fragment key={key}>
              <StyledSidebarBackdrop
                style={{
                  opacity,
                }}
              />
              <StyledUserSidebar
                radius={0}
                raised
                ref={trigger.popupRef}
                style={{
                  transform,
                }}>
                <AnimatedMenu
                  readonly={state !== 'update'}
                  onDidSelect={trigger.close}>
                  <UserMenuContent />
                </AnimatedMenu>
              </StyledUserSidebar>
            </React.Fragment>
          ),
      )}
    </PopupContext.Provider>
  )
}

const TabletPlus = styled.div`
  display: flex;

  ${media.phoneOnly`
    display: none;
  `}
`
const PhoneOnly = styled.div`
  display: flex;

  ${media.tabletPlus`
    display: none;
  `}
`

const Layout = props => {
  let route = useCurrentRoute()
  let user = useCurrentUser()

  let searchInput = (
    <SearchInput
      label="Search"
      css={css`
        width: 100%;
      `}
    />
  )

  let rhs =
    user === undefined ? null : !!user ? (
      <>
        <AvailableStampsIndicator count={2} />
        <TabletPlus>
          <UserDropdown />
        </TabletPlus>
        <TabletPlus>
          <ButtonLink remaining={1} href="/pen">
            Pen
          </ButtonLink>
        </TabletPlus>
      </>
    ) : (
      <>
        <AuthButtonLink
          href="/login"
          css={css`
            margin: 0 1rem;
          `}
          outline>
          Sign In
        </AuthButtonLink>
        <TabletPlus
          css={css`
            margin-left: -0.5rem;
          `}>
          <AuthButtonLink href="/join">Join</AuthButtonLink>
        </TabletPlus>
      </>
    )

  return (
    <Wrapper>
      <TabletPlus>
        <HomeLink href="/">
          <Icon glyph="brand" size="2.5rem" />
        </HomeLink>
      </TabletPlus>
      <Header>
        <PhoneOnly
          css={css`
            display: flex;
          `}>
          <UserSidebar />
        </PhoneOnly>

        <PhoneOnly
          css={css`
            flex: 1;
          `}>
          {route.url.pathname === '/search' ? (
            searchInput
          ) : (
            <h1
              css={css`
                font-weight: 700;
                font-size: 1.2rem;
                margin-left: 0.5rem;
              `}>
              {route.title}
            </h1>
          )}
        </PhoneOnly>
        <TabletPlus
          css={css`
            flex: 100;
            max-width: 400px;
          `}>
          {searchInput}
        </TabletPlus>
        <div
          css={css`
            ${media.tabletPlus`
              flex: 1;
            `}
          `}
        />
        {rhs}
      </Header>
      <Navbar>
        <PhoneOnly
          css={css`
            display: flex;
            flex: 1;
          `}>
          <NavLink href="/" title="Home" exact>
            <Icon glyph="brand" size="1.5rem" />
          </NavLink>
        </PhoneOnly>
        <PhoneOnly
          css={css`
            display: flex;
            flex: 1;
          `}>
          <NavLink href="/search" title="Search">
            <Icon glyph="search" size="1.5rem" />
          </NavLink>
        </PhoneOnly>
        <NavLink href="/notifications" title="Notifications">
          <Icon glyph="bell" size="1.5rem" />
        </NavLink>
        <NavLink href="/messages" title="Messages">
          <Icon glyph="envelope" size="1.5rem" />
        </NavLink>
        <NavLink href="/watch" title="Watch">
          <Icon glyph="glasses" size="1.5rem" />
        </NavLink>
      </Navbar>
      <Main>{props.children}</Main>
    </Wrapper>
  )
}

export default Layout
