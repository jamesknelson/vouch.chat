import fs from 'fs'
import { createMemoryNavigation, NotFoundError } from 'navi'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { NaviProvider, View } from 'react-navi'
import HelmetProvider from 'react-navi-helmet-async'
import { StripeProvider } from 'react-stripe-elements'
import { ServerStyleSheet, ThemeProvider } from 'styled-components/macro'

import { BackendContext, StripeContext } from 'context'
import theme from 'theme'

import Backend from './backend'
import GlobalResetStyle from './reset.css'
import routes from './routes'

const renderer = async (request, response) => {
  let backend, navigation, sheet

  // Read in a HTML template, into which we'll substitute React's rendered
  // content, styles, and Navi's route state.
  let template = fs.readFileSync(process.env.HTML_TEMPLATE_PATH, 'utf8')
  let [header, footer] = template.split('<div id="root">%RENDERED_CONTENT%')

  try {
    // Create a `backend` object through which routes and the React app can
    // access the API.
    backend = new Backend({ ssr: true })

    navigation = createMemoryNavigation({
      context: {
        backend,

        // We'll handle authentication in the client so that all rendered
        // pages are identical regardless of who views them. This allows for
        // anything we render to be cached, at least for a short while.
        currentUser: undefined,

        // Some thing don't need rendering when doing SSR.
        ssr: true,
      },
      url: request.url,
      routes,
    })
    sheet = new ServerStyleSheet()

    // Wait for Navi to get the page's data and route, so that everything can
    // be synchronously rendered with `renderToString`.
    let route = await navigation.getRoute()

    let body = renderToString(
      sheet.collectStyles(
        <HelmetProvider>
          <BackendContext.Provider value={backend}>
            {/* Our provider makes stripe available within hooks, while the
            stripe library's provider is required for its card form */}
            <StripeContext.Provider value={null}>
              <StripeProvider stripe={null}>
                <ThemeProvider theme={theme}>
                  <NaviProvider navigation={navigation}>
                    {/*
                      Putting the global styles any deeper in the tree causes
                      them to re-render on each navigation, even on production.
                      Unfortunately this means they have to be repeated across
                      the server and the client code.
                    */}
                    <GlobalResetStyle />

                    <View />
                  </NaviProvider>
                </ThemeProvider>
              </StripeProvider>
            </StripeContext.Provider>
          </BackendContext.Provider>
        </HelmetProvider>,
      ),
    )

    // Extract the navigation state into a script tag so that data doesn't need
    // to be fetched twice across server and client.
    let state = `<script>window.__NAVI_STATE__=${JSON.stringify(
      navigation.extractState() || {},
    ).replace(/</g, '\\u003c')};</script>`

    // Generate stylesheets containing the minimal CSS necessary to render the
    // page. The rest of the CSS will be loaded at runtime.
    let styleTags = sheet.getStyleTags()

    // Generate the complete HTML
    let html = header + state + styleTags + '<div id="root">' + body + footer

    // The route status defaults to `200`, but can be set to other statuses by
    // passing a `status` option to `route()`
    response.status(route.status).send(html)
  } catch (error) {
    // Render an empty page, letting the client actually generate the 404
    // message.
    if (error instanceof NotFoundError) {
      let html = header + '<div id="root">' + footer
      response.status(404).send(html)
      return
    }

    // Log an error, but only render it in development mode.
    let html
    console.error(error)
    if (process.env.NODE_ENV === 'production') {
      html = `<h1>500 Error - Something went wrong.</h1>`
    } else {
      html = `<h1>500 Error</h1><pre>${String(error)}</pre>` + header + footer
    }
    response.status(500).send(html)
  } finally {
    sheet.seal()
    backend.dispose()
    navigation.dispose()
  }
}

export default renderer
