import React, { useEffect, useMemo, useState } from 'react'
import { animated, useTransition } from 'react-spring'
import { dimensions } from 'theme'
import LayoutAuthFooter from './layoutAuthFooter'
import LayoutContext from './layoutContext'
import PhoneLayout from './phoneLayout'
import TabletPlusLayout from './tabletPlusLayout'

const AnimatedAuthFooter = animated(LayoutAuthFooter)

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

  return (
    <LayoutContext.Provider value={context}>
      <PhoneLayout
        indexPathname={indexPathname}
        minimal={minimal}
        withoutFlipperSpinner={withoutFlipperSpinner}>
        {props.children}
      </PhoneLayout>
      <TabletPlusLayout withoutFlipperSpinner={withoutFlipperSpinner}>
        {props.children}
      </TabletPlusLayout>
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
