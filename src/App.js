import React from 'react'
import { View, useCurrentRoute } from 'react-navi'
import Layout from 'components/layout'
import { CurrentUserContext, CurrentLanguageContext } from 'context'
import { ControlIdProvider } from 'hooks/useControlId'

function App({ navigationContext = {} }) {
  let currentUser = navigationContext.currentUser
  let currentRoute = useCurrentRoute()
  let {
    minimalLayout: minimal = false,
    layoutIndexHeaderActions: indexHeaderActions = null,
    layoutIndexHeaderTitle: indexHeaderTitle = null,
    layoutIndexPathname: indexPathname = null,
    layoutHeaderActions: headerActions = null,
    layoutHeaderTitle: headerTitle = currentRoute.title,
    layoutShowHistoryBack: showHistoryBack = false,
    layoutShowIndexOnPhone: showIndexOnPhone = false,
  } = currentRoute.data

  return (
    <ControlIdProvider>
      <CurrentUserContext.Provider value={navigationContext.currentUser}>
        <CurrentLanguageContext.Provider value={navigationContext.language}>
          <Layout
            user={currentUser}
            minimal={minimal}
            indexHeaderActions={indexHeaderActions}
            indexHeaderTitle={indexHeaderTitle}
            indexPathname={indexPathname}
            headerActions={headerActions}
            headerTitle={headerTitle}
            showHistoryBack={showHistoryBack}
            showIndexOnPhone={showIndexOnPhone}>
            <View />
          </Layout>
        </CurrentLanguageContext.Provider>
      </CurrentUserContext.Provider>
    </ControlIdProvider>
  )
}

export default App
