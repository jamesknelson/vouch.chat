import React, { useEffect, useState } from 'react'
import { useCurrentRoute } from 'react-navi'
import { animated, useTransition } from 'react-spring'
import { useCurrentUser } from 'context'
import { dimensions } from 'theme'
import LayoutAuthFooter from './layoutAuthFooter'
import LayoutContext from './layoutContext'
import PhoneLayout from './phoneLayout'
import TabletPlusLayout from './tabletPlusLayout'

const AnimatedAuthFooter = animated(LayoutAuthFooter)

const Layout = props => {
  let currentRoute = useCurrentRoute()
  let currentUser = useCurrentUser()

  let [showAuthFooter, setShowAuthFooter] = useState(false)
  let shouldShowAuthFooter = currentUser === null && !currentRoute.data.auth

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

  return (
    <LayoutContext.Provider
      value={{
        footerOverlayHeight:
          // Wait until the transition has completed before updating this,
          // as we don't want to hide things during the transition.
          showAuthFooter && authFooterTransitions.length === 1
            ? dimensions.bar
            : 0,
      }}>
      <PhoneLayout currentRoute={currentRoute} currentUser={currentUser}>
        {props.children}
      </PhoneLayout>
      <TabletPlusLayout currentUser={currentUser}>
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
