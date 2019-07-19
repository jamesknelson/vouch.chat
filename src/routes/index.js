import { compose, lazy, map, mount, redirect, withView } from 'navi'
import React from 'react'
import App from 'App'

let logout = map(async ({ context, params }) => {
  // Auth state is stored on the client so we can't log out from the server.
  if (context.ssr) {
    return lazy(() => import('./loading'))
  }

  let redirectTo = params.redirectTo || '/'
  if (redirectTo.indexOf('logout') !== -1) {
    redirectTo = '/'
  }

  await context.backend.auth.signOut()

  return redirect(redirectTo)
})

let routes = mount({
  '/': lazy(() => import('./landing')),
  // '/chat': lazy(() => import('./messages')),
  '/notifications': lazy(() => import('./notifications')),
  '/cast': lazy(() => import('./share')),
  '/join': lazy(() => import('./join')),
  '/login': lazy(() => import('./login')),

  // The `readList` route can route just by having a username param on
  // the params (so long as it's not also on the query).
  '/read': lazy(() => import('./readingList')),
  '/:username': lazy(() => import('./readingList')),

  '/explore': lazy(() => import('./explore')),
  '/recover': lazy(() => import('./recover')),

  '/welcome': lazy(() => import('./welcome')),
})

let routesWithUserRedirects = map((request, context) => {
  let to
  if (context.currentUser) {
    let user = context.currentUser
    if (!user.hasChosenPlan) {
      if (request.params.plan) {
        to = '/setup/payment?plan=' + request.params.plan
      } else {
        to = '/wigs'
      }
    } else if (!user.username) {
      if (user.canSetUsername) {
        to = '/setup/username'
      } else {
        to = '/setup/verify'
      }
    }
  }

  return mount({
    '/logout': logout,
    '/pages': mount({
      '/policies': lazy(() => import('./policies')),
    }),
    '/settings': lazy(() => import('./settings')),
    '/setup': lazy(() => import('./setup')),
    '/verify': lazy(() => import('./verify')),
    '/wigs': lazy(() => import('./setup/plans')),
    '*': to ? redirect(to, { exact: false }) : routes,
  })
})

export default compose(
  withView((request, context) => <App navigationContext={context} />),
  routesWithUserRedirects,
)
