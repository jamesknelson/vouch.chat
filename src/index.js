import { createBrowserNavigation } from 'navi'
import React from 'react'
import ReactDOM from 'react-dom'
import { NaviProvider, View } from 'react-navi'
import HelmetProvider from 'react-navi-helmet-async'
import { StripeProvider } from 'react-stripe-elements'
import GlobalIconFontStyle from 'components/icon/font'
import GlobalResetStyle from './reset.css'
import Backend from './backend'
import config from './config'
import { BackendContext } from './context'
import routes from './routes'

async function main() {
  let backend = new Backend()
  let context = {
    backend,
    currentUser: undefined,

    // Hydrate expects the original content to be identical to the server
    // rendered content, so we'll start out with ssr: true and change it
    // after the hydrate.
    ssr: true,
  }
  let navigation = createBrowserNavigation({
    routes,
    context,
  })

  function updateContext(change) {
    context = { ...context, ...change }
    navigation.setContext(context)
  }

  let route = await navigation.getRoute()
  let renderer = route.type === 'ready' ? ReactDOM.hydrate : ReactDOM.render

  renderer(
    <HelmetProvider>
      <BackendContext.Provider value={backend}>
        <StripeProvider
          stripe={window.Stripe ? window.Stripe(config.stripe.apiKey) : null}>
          <NaviProvider navigation={navigation}>
            {/*
              Putting the global styles any deeper in the tree causes them to
              re-render on each navigation, even on production.
            */}
            <GlobalResetStyle />
            <GlobalIconFontStyle />
            <View />
          </NaviProvider>
        </StripeProvider>
      </BackendContext.Provider>
    </HelmetProvider>,
    document.getElementById('root'),
  )

  let currentUser = await backend.currentUser.getCurrentValue()
  if (currentUser !== undefined) {
    updateContext({ currentUser, ssr: false })
  } else {
    updateContext({ ssr: false })
  }
  backend.currentUser.subscribe(currentUser => {
    updateContext({ currentUser })
  })
}

main()
