import React, { useContext } from 'react'
import styled, { css } from 'styled-components/macro'

import { phoneOnly } from 'components/media'
import { Menu } from 'components/menu'
import Sidebar from 'components/sidebar'
import useLastScrollDirection from 'hooks/useLastScrollDirection'
import useTrigger from 'hooks/useTrigger'
import { colors, dimensions, easings, media, shadows } from 'theme'
import LayoutContext from './layoutContext'
import { LayoutHeaderContent } from './layoutHeaderContent'
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

const StyledPhoneHeaderOverlay = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: ${dimensions.bar};
  width: 100%;
  position: ${props => (props.minimal ? 'relative' : 'fixed')};
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

const PhoneHeaderOverlay = ({ hide, indexPathname, minimal }) => {
  let { showHistoryBack, showIndexOnPhone } = useContext(LayoutContext)

  let lhs =
    indexPathname && !showIndexOnPhone ? (
      <NavItem
        hideActiveIndicator
        href={indexPathname}
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
    <StyledPhoneHeaderOverlay hide={hide} minimal={minimal}>
      <LayoutHeaderContent
        left={lhs}
        showBack={showHistoryBack}
        index={showIndexOnPhone}
      />
    </StyledPhoneHeaderOverlay>
  )
}

function PhoneLayoutContent({
  children,
  indexPathname,
  minimal,
  currentUser,
  ...rest
}) {
  let lastScrollDirection = useLastScrollDirection()

  let hideTitle =
    !minimal && lastScrollDirection && lastScrollDirection === 'down'

  return (
    <PhoneWrapper {...rest}>
      <PhoneHeaderOverlay
        hide={hideTitle}
        indexPathname={indexPathname}
        minimal={minimal}
      />
      <StyledPhoneNavbar leaveTitleSpace={!hideTitle} hide={minimal}>
        <NavItems />
        <ProfileFlipper currentUser={currentUser} sizeRem={2} />
      </StyledPhoneNavbar>
      <StyledMain>{children}</StyledMain>
    </PhoneWrapper>
  )
}

const PhoneLayout = phoneOnly(PhoneLayoutContent)

export default PhoneLayout
