import React, { useEffect, useMemo, useState } from 'react'
import { useLoadingRoute } from 'react-navi'
import { animated, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'

import { LoadingBar } from 'components/loading'
import { dimensions, media } from 'theme'
import LayoutAuthFooter from './layoutAuthFooter'
import LayoutContext from './layoutContext'
import PhoneLayoutHeader from './phoneLayoutHeader'
import TabletPlusLayoutHeader from './tabletPlusLayoutHeader'

const AnimatedAuthFooter = animated(LayoutAuthFooter)

// The same wrapper and main components have to be rendered across both
// layouts, otherwise the user can lose input state when resizing.
const StyledWrapper = styled.div`
  ${media.phoneOnly`
    min-height: 100%;
  `}
  ${media.tabletPlus`
    display: grid;
    min-height: 100%;
    width: 100%;
    grid-template-columns: ${dimensions.bar} 1fr;
    grid-template-areas: 'navbar main';
  `}
`
const StyledMain = styled.main`
  ${media.phoneOnly`
    min-height: 100%;
    ${props =>
      !props.minimal &&
      css`
        padding-top: calc(${dimensions.bar} * 7 / 4);
      `}
  `}
  ${media.tabletPlus`
    display: grid;
    grid-area: main;
  `}
`

const Layout = props => {
  let {
    user,
    minimal = false,
    indexHeaderActions = null,
    indexHeaderTitle = null,
    indexPathname = null,
    headerActions = null,
    headerTitle = null,
    withoutFlipperSpinner = false,
    showHistoryBack = false,
    showIndexOnPhone = false,
  } = props

  let [showAuthFooter, setShowAuthFooter] = useState(false)
  let shouldShowAuthFooter = user === null && !minimal

  useEffect(() => {
    setShowAuthFooter(shouldShowAuthFooter)
  }, [shouldShowAuthFooter])

  let authFooterTransitions = useTransition(showAuthFooter, null, {
    config: {
      tension: 320,
    },
    from: { transform: `translateY(100%)` },
    enter: { transform: `translateY(0%)` },
    leave: { transform: `translateY(100%)` },
  })

  // Wait until the transition has completed before updating this,
  // as we don't want to hide things during the transition.
  let footerOverlayHeight =
    showAuthFooter && authFooterTransitions.length === 1
      ? dimensions.bar
      : '0px'

  let context = useMemo(
    () => ({
      footerOverlayHeight,
      minimal,
      indexHeaderActions,
      indexHeaderTitle,
      indexPathname,
      headerActions,
      headerTitle,
      showHistoryBack,
      showIndexOnPhone,
    }),
    [
      footerOverlayHeight,
      minimal,
      indexHeaderActions,
      indexHeaderTitle,
      indexPathname,
      headerActions,
      headerTitle,
      showHistoryBack,
      showIndexOnPhone,
    ],
  )

  let loadingRoute = useLoadingRoute()

  return (
    <LayoutContext.Provider value={context}>
      <LoadingBar active={!!loadingRoute} />
      <StyledWrapper>
        <PhoneLayoutHeader
          indexPathname={indexPathname}
          minimal={minimal}
          withoutFlipperSpinner={withoutFlipperSpinner}
        />
        <TabletPlusLayoutHeader withoutFlipperSpinner={withoutFlipperSpinner} />
        <StyledMain minimal={minimal}>{props.children}</StyledMain>
      </StyledWrapper>
      {authFooterTransitions.map(
        ({ item, props: style, key }) =>
          item && (
            <AnimatedAuthFooter
              style={style}
              key={key}
              onClose={() => setShowAuthFooter(false)}
            />
          ),
      )}
    </LayoutContext.Provider>
  )
}

export default Layout
