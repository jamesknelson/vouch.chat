import { createBrowserNavigation } from 'navi'
import React from 'react'
import ReactDOM from 'react-dom'
import { NaviProvider, View } from 'react-navi'
import HelmetProvider from 'react-navi-helmet-async'
import { StripeProvider } from 'react-stripe-elements'
import { ThemeProvider } from 'styled-components/macro'

import GlobalIconFontStyle from 'components/icon/font'
import theme from 'theme'

import GlobalResetStyle from './reset.css'
import Backend from './backend'
import config from './config'
import { BackendContext, StripeContext } from './context'
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
  let stripe = window.Stripe ? window.Stripe(config.stripe.apiKey) : null

  renderer(
    <HelmetProvider>
      <BackendContext.Provider value={backend}>
        {/* Our provider makes stripe available within hooks, while the
            stripe library's provider is required for its card form */}
        <StripeContext.Provider value={stripe}>
          <StripeProvider stripe={stripe}>
            <ThemeProvider theme={theme}>
              <NaviProvider navigation={navigation}>
                {/*
                  Putting the global styles any deeper in the tree causes them to
                  re-render on each navigation, even on production.
                */}
                <GlobalResetStyle />
                <GlobalIconFontStyle />
                <View />
              </NaviProvider>
            </ThemeProvider>
          </StripeProvider>
        </StripeContext.Provider>
      </BackendContext.Provider>
    </HelmetProvider>,
    document.getElementById('root'),
  )

  updateContext({ ssr: false })

  let currentUser = await backend.currentUser.getCurrentValue()
  if (currentUser !== undefined) {
    updateContext({ currentUser })
  }
  backend.currentUser.subscribe(currentUser => {
    updateContext({ currentUser })
  })
}

main()
