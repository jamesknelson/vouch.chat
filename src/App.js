import React from 'react'
import { View } from 'react-navi'
import Layout from 'components/layout'
import { CurrentUserContext, CurrentLanguageContext } from 'context'
import { ControlIdProvider } from 'hooks/useControlId'

function App({ navigationContext = {} }) {
  return (
    <ControlIdProvider>
      <CurrentUserContext.Provider value={navigationContext.currentUser}>
        <CurrentLanguageContext.Provider value={navigationContext.language}>
          <Layout>
            <View />
          </Layout>
        </CurrentLanguageContext.Provider>
      </CurrentUserContext.Provider>
    </ControlIdProvider>
  )
}

export default App
