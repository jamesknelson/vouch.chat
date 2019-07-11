import React from 'react'
import { Link, useCurrentRoute } from 'react-navi'
import styled, { css } from 'styled-components/macro'

import { BrandImage } from 'components/brand'
import { LoginButton, RegisterButton } from 'components/button'
import { phoneOnly } from 'components/media'
import { Menu } from 'components/menu'
import Sidebar from 'components/sidebar'
import useLastScrollDirection from 'hooks/useLastScrollDirection'
import useTrigger from 'hooks/useTrigger'
import { colors, dimensions, easings, focusRing, media, shadows } from 'theme'
import { StyledHeaderActions, StyledHeaderTitle } from './layoutHeader'
import { NavItem, NavItems } from './layoutNavItems'
import LayoutNavMenuItems from './layoutNavMenuItems'
import ProfileFlipper from './layoutProfileFlipper'

const PhoneWrapper = styled.div`
  height: 100%;
  min-height: 100%;
`

const StyledMain = styled.main`
  min-height: 100%;
  padding-top: calc(${dimensions.bar} * 7 / 4);
`

const SidebarMoreMenu = ({ children, side }) => {
  let trigger = useTrigger({
    triggerOnSelect: true,
  })

  return (
    <>
      {children(trigger.ref)}
      <Sidebar
        open={trigger.active}
        ref={trigger.popupRef}
        side={side}
        onClose={trigger.close}>
        <Menu onDidSelect={trigger.close}>
          <LayoutNavMenuItems />
        </Menu>
      </Sidebar>
    </>
  )
}

const HeaderBrandTextLink = () => (
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

const StyledPhoneHeaderOverlay = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: ${dimensions.bar};
  width: 100%;
  position: ${props => (props.relative ? 'relative' : 'fixed')};
  top: 0;
  z-index: 10;
  left: 0;
  padding: 0 0 0 0.75rem;
  transition: transform 200ms ${easings.easeOut};
  transform: translateY(${props => (props.hide ? `-${dimensions.bar}` : 0)});
`

const StyledPhoneNavbar = styled.nav`
  display: flex;
  align-items: stretch;
  justify-content: space-between;

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

const PhoneHeaderOverlay = ({ hide, relative }) => {
  let {
    data: { auth, header, indexHeader },
    url,
  } = useCurrentRoute()
  let headerTitle =
    (header && header.title) || (indexHeader && indexHeader.title)
  let actions
  if (auth) {
    actions = (
      <div style={{ margin: '0 1rem' }}>
        {!/^\/login/.test(url.pathname) ? <LoginButton /> : <RegisterButton />}
      </div>
    )
  } else {
    actions = (header && header.actions) || (indexHeader && indexHeader.actions)
  }

  let lhs =
    header && indexHeader ? (
      <NavItem
        hideActiveIndicator
        href={indexHeader.mountpath}
        glyph="chevron-left"
        tooltip="Back"
        css={css`
          flex: 0;
          margin-right: 0.75rem;
        `}
      />
    ) : (
      <SidebarMoreMenu side="left">
        {ref => (
          <NavItem
            glyph="menu1"
            tooltip="More"
            ref={ref}
            css={css`
              flex: 0;
              margin-right: 0.75rem;
            `}
          />
        )}
      </SidebarMoreMenu>
    )

  return (
    <StyledPhoneHeaderOverlay hide={hide} relative={relative}>
      {lhs}
      {auth || !headerTitle ? (
        <HeaderBrandTextLink />
      ) : (
        <StyledHeaderTitle>{headerTitle}</StyledHeaderTitle>
      )}
      <StyledHeaderActions>
        {actions || (
          <div
            css={css`
              margin-left: 1rem;
            `}
          />
        )}
      </StyledHeaderActions>
    </StyledPhoneHeaderOverlay>
  )
}

function PhoneLayoutContent({
  children,
  className,
  currentRoute,
  currentUser,
}) {
  let lastScrollDirection = useLastScrollDirection()

  let hideNavbar = currentRoute.data.auth
  let hideTitle =
    !hideNavbar && lastScrollDirection && lastScrollDirection === 'down'

  return (
    <PhoneWrapper className={className}>
      <PhoneHeaderOverlay hide={hideTitle} relative={hideNavbar} />
      <StyledPhoneNavbar leaveTitleSpace={!hideTitle} hide={hideNavbar}>
        <NavItems />
        <ProfileFlipper currentUser={currentUser} sizeRem={2} />
      </StyledPhoneNavbar>
      <StyledMain>{children}</StyledMain>
    </PhoneWrapper>
  )
}

const PhoneLayout = phoneOnly(PhoneLayoutContent)

export default PhoneLayout
