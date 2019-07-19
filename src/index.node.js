import fs from 'fs'
import { createMemoryNavigation, NotFoundError } from 'navi'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { NaviProvider, View } from 'react-navi'
import { StripeProvider } from 'react-stripe-elements'
import { ServerStyleSheet } from 'styled-components/macro'
import Backend from './backend'
import GlobalIconFontStyle from 'components/icon/font'
import GlobalResetStyle from './reset.css'
import routes from './routes'
import { BackendContext } from 'context'

const renderer = async (request, response) => {
  let backend, navigation, sheet
  let template = fs.readFileSync(process.env.HTML_TEMPLATE_PATH, 'utf8')
  let [header, footer] = template.split('<div id="root">%RENDERED_CONTENT%')

  try {
    backend = new Backend({ ssr: true })
    navigation = createMemoryNavigation({
      context: {
        backend,
        currentUser: undefined,
        ssr: true,
      },
      request,
      routes,
    })
    sheet = new ServerStyleSheet()

    await navigation.getRoute()

    // The index.html file is a template, which will have environment variables
    // and bundled scripts and stylesheets injected during the build step, and
    // placed at the location specified by `process.env.HTML_TEMPLATE_PATH`.
    //
    // To customize the rendered HTML, you can add other placeholder strings,
    // and replace them within this function -- just as %RENDERED_CONTENT% is
    // replaced. Note however that if you name the placeholder after an
    // environment variable available at build time, then it will be
    // automatically replaced by the build script.
    let body = renderToString(
      sheet.collectStyles(
        <BackendContext.Provider value={backend}>
          <StripeProvider stripe={null}>
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
        </BackendContext.Provider>,
      ),
    )

    // Extract the navigation state into a script tag to bootstrap the browser Navigation.
    let state = `<script>window.__NAVI_STATE__=${JSON.stringify(
      navigation.extractState() || {},
    ).replace(/</g, '\\u003c')};</script>`

    let styleTags = sheet.getStyleTags()
    let html = header + state + styleTags + '<div id="root">' + body + footer
    response.send(html)
  } catch (error) {
    if (error instanceof NotFoundError) {
      let html = header + '<div id="root">' + footer
      response.status(404).send(html)
      return
    }

    let html
    console.error(error)
    if (process.env.NODE_ENV === 'production') {
      html = `<h1>500 Error</h1>`
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
