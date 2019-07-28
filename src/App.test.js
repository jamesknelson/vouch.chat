import { createBrowserNavigation } from 'navi'
import React from 'react'
import ReactDOM from 'react-dom'
import { NaviProvider, View } from 'react-navi'
import { StripeProvider } from 'react-stripe-elements'
import { ThemeProvider } from 'styled-components/macro'

import { BackendContext, StripeContext } from 'context'
import theme from 'theme'

import Backend from './backend'
import config from './config'
import routes from './routes'

const stripe = window.Stripe ? window.Stripe(config.stripe.apiKey) : null

it('renders without crashing', async () => {
  let backend = new Backend()

  let navigation = createBrowserNavigation({
    context: {
      backend,
      currentUser: undefined,
      ssr: true,
    },
    routes,
  })

  await navigation.getRoute()

  const app = (
    <BackendContext.Provider value={backend}>
      {/* Our provider makes stripe available within hooks, while the
      stripe library's provider is required for its card form */}
      <StripeContext.Provider value={stripe}>
        <StripeProvider stripe={stripe}>
          <ThemeProvider theme={theme}>
            <NaviProvider navigation={navigation}>
              <View />
            </NaviProvider>
          </ThemeProvider>
        </StripeProvider>
      </StripeContext.Provider>
    </BackendContext.Provider>
  )
  const div = document.createElement('div')
  ReactDOM.render(app, div)
  ReactDOM.unmountComponentAtNode(div)
})
