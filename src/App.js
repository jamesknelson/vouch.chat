import React from 'react'
import { View } from 'react-navi'
import Layout from 'components/layout'
import { CurrentUserContext, CurrentLanguageContext } from 'context'

function App(props) {
  return (
    <CurrentUserContext.Provider value={props.currentUser}>
      <CurrentLanguageContext.Provider value={props.language}>
        <Layout>
          <View />
        </Layout>
      </CurrentLanguageContext.Provider>
    </CurrentUserContext.Provider>
  )
}

export default App
