import React from 'react'
import styled from 'styled-components/macro'

import { tabletPlus } from 'components/media'
import { PopupProvider, PopupTrigger, PopupMenu } from 'components/popup'
import Tooltip from 'components/tooltip'
import { colors, dimensions, shadows } from 'theme'
import { NavItems, NavItem } from './layoutNavItems'
import LayoutNavMenuItems from './layoutNavMenuItems'
import ProfileFlipper from './layoutProfileFlipper'

const StyledTabletPlusNavbar = styled.nav`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  grid-area: navbar;
  position: fixed;
  top: 0;
  z-index: 3;
  bottom: 0;
  left: 0;
  border-right: 1px solid ${colors.structure.border};
  width: ${dimensions.bar};
  height: 100vh;
`

const NavbarCorner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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

const PopupMoreMenu = ({ children }) => {
  return (
    <PopupProvider triggerOnFocus triggerOnSelect>
      <PopupTrigger>{children}</PopupTrigger>
      <PopupMenu placement="right-start">
        <LayoutNavMenuItems />
      </PopupMenu>
    </PopupProvider>
  )
}

function TabletPlusLayoutHeaderContent({
  children,
  withoutFlipperSpinner,
  ...rest
}) {
  return (
    <StyledTabletPlusNavbar {...rest}>
      <NavbarCorner>
        <Tooltip content="Profile" placement="right">
          <ProfileFlipper withoutSpinner={withoutFlipperSpinner} />
        </Tooltip>
      </NavbarCorner>
      <NavItems />
      <PopupMoreMenu>
        {ref => <NavItem glyph="ellipsis" ref={ref} />}
      </PopupMoreMenu>
    </StyledTabletPlusNavbar>
  )
}

const TabletPlusLayoutHeader = tabletPlus(TabletPlusLayoutHeaderContent)

export default TabletPlusLayoutHeader
