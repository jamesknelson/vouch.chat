import fs from 'fs'
import { createMemoryNavigation } from 'navi'
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
  let [header, footer] = template.split('%RENDERED_CONTENT%')

  try {
    backend = new Backend()
    navigation = createMemoryNavigation({
      context: {
        backend,
        currentUser: undefined,
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
    let styleTags = sheet.getStyleTags()
    let html = header + styleTags + body + footer
    response.send(html)
  } catch (error) {
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
