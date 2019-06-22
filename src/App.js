import React from 'react'
import { View } from 'react-navi'
import GlobalStyle from './reset.css'
import GlobalIconFontStyle from 'components/icon/font'
import Layout from 'components/layout'
import { CurrentUserContext, CurrentLanguageContext } from 'context'

function App(props) {
  return (
    <>
      <GlobalStyle />
      <GlobalIconFontStyle />
      <CurrentUserContext.Provider value={props.currentUser}>
        <CurrentLanguageContext.Provider value={props.language}>
          <Layout>
            <View />
          </Layout>
        </CurrentLanguageContext.Provider>
      </CurrentUserContext.Provider>
    </>
  )
}

export default App
