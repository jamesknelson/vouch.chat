import { rgba } from 'polished'
import React from 'react'
import { Link } from 'react-navi'
import styled, { css } from 'styled-components/macro'
import Tippy from '@tippy.js/react'
import { colors, dimensions, easings, focusRing, shadows } from 'theme'
import { UserAvatar } from 'components/avatar'
import { PenButtonLink } from 'components/button'
import Icon from 'components/icon'
import SearchInput from 'components/searchInput'
import {
  PopupProvider,
  PopupTrigger,
  Popup,
  PopupMenuLink,
  PopupMenuDivider,
} from 'components/popup'

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
`

const Header = styled.header`
  align-items: center;
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.border};
  box-shadow: ${shadows.card()};
  display: flex;
  height: ${dimensions.bar};
  justify-content: space-between;
  left: ${dimensions.bar};
  padding: 1rem;
  position: fixed;
  top: 0;
  z-index: 3;
  width: calc(100% - ${dimensions.bar});
`

const Body = styled.div`
  height: 100%;
  min-height: 100%;
`

const Sidebar = styled.nav`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  border-right: 1px solid ${colors.structure.border};
  height: calc(100% - ${dimensions.bar});
  padding-top: 0.75rem;
  position: fixed;
  top: ${dimensions.bar};
  width: ${dimensions.bar};
`

const Main = styled.main`
  padding-left: ${dimensions.bar};
  padding-top: ${dimensions.bar};
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
  z-index: 2;

  ${focusRing('::before', { padding: '-0.6rem' })}
`

const StyledNavLink = styled(Link)`
  align-items: center;
  color: ${colors.ink.black};
  display: flex;
  justify-content: center;
  margin: 0.25rem 0;
  padding: 0.25rem 0;
  width: ${dimensions.bar};
  position: relative;

  text-shadow: 0 0 0.75rem rgba(84, 96, 108, 0);

  transition: text-shadow 200ms ${easings.easeOut};

  ::after {
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    right: 0px;
    background-color: ${rgba(colors.ink.black, 0)};
    box-shadow: 0 0 0 0 ${rgba(colors.ink.black, 0)};
    transition: background-color 200ms ${easings.easeOut},
      box-shadow 200ms ${easings.easeOut};
  }

  &.NavLink-active {
    text-shadow: 0 0 0.75rem rgba(84, 96, 108, 0.75);

    ::after {
      background-color: ${rgba(colors.ink.black, 0.15)};
      box-shadow: 0 0 2px 1px ${rgba(colors.ink.black, 0.08)};
    }
  }

  :focus::after {
    background-color: ${colors.focus.default};
    box-shadow: ${shadows.focusSoft()};
    width: 2px;
  }

  &:focus {
    text-shadow: 0 0 0.75rem ${rgba(colors.focus.default, 0.8)};
  }
`

const NavLink = ({ title, ...props }) => (
  <Tippy
    placement="right"
    touch={false}
    arrow={true}
    arrowType="round"
    content={
      <span style={{ fontSize: '14px', fontWeight: '600' }}>{title}</span>
    }>
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
      ${focusRing('::after', { padding: '2px 0.5rem' })}
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
      <Popup placement="bottom-end">
        <PopupMenuLink href="/account">Account Details</PopupMenuLink>
        <PopupMenuDivider />
        <PopupMenuLink href="/logout">Logout</PopupMenuLink>
      </Popup>
    </PopupProvider>
  )
}

const Layout = props => (
  <Wrapper>
    <HomeLink href="/">
      <Icon glyph="brand" size="2.5rem" />
    </HomeLink>
    <Header>
      <SearchInput
        label="Search"
        css={css`
          max-width: 400px;
          flex: 1;
        `}
      />
      <div
        css={css`
          flex: 1;
        `}
      />
      <AvailableStampsIndicator count={2} />
      <UserDropdown />
      <PenButtonLink remaining={1} href="/pen">
        Pen
      </PenButtonLink>
    </Header>
    <Body>
      <Sidebar>
        <NavLink href="/notifications" title="Notifications">
          <Icon glyph="bell" size="1.75rem" />
        </NavLink>
        <NavLink href="/messages" title="Messages">
          <Icon glyph="envelope" size="1.75rem" />
        </NavLink>
        <NavLink href="/watch" title="Watch">
          <Icon glyph="glasses" size="1.75rem" />
        </NavLink>
      </Sidebar>
      <Main>{props.children}</Main>
    </Body>
  </Wrapper>
)

export default Layout
