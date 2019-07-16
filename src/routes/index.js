import { compose, lazy, map, mount, redirect, withView } from 'navi'
import React from 'react'
import App from 'App'

let logout = map(async ({ context }) => {
  await context.backend.auth.signOut()
  return redirect('/')
})

let routes = mount({
  '/': lazy(() => import('./landing')),
  '/messages': lazy(() => import('./messages')),
  '/notifications': lazy(() => import('./notifications')),
  '/share': lazy(() => import('./share')),
  '/read': lazy(() => import('./readingList')),
  '/explore': lazy(() => import('./explore')),
  '/recover': lazy(() => import('./recover')),
  '/login': lazy(() => import('./login')),
  '/join': lazy(() => import('./join')),
  '/plans': lazy(() => import('./plans')),
  '/:username': map(async ({ params }) => {
    if (params.username === 'james') {
      const { default: profile } = await import('./profile')
      return profile
    } else {
      return mount({})
    }
  }),
  '/welcome': lazy(() => import('./welcome')),
  // '/subscribe': lazy(() => import('./subscribe')),
  // '/thankyou': lazy(() => import('./thankyou')),
})

let routesWithUserRedirects = map((request, context) => {
  let to
  if (context.currentUser) {
    let user = context.currentUser
    if (!user.hasChosenPlan) {
      if (request.params.plan) {
        to = '/setup/payment?plan=' + request.params.plan
      } else {
        to = '/setup/plan'
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
    '/settings': lazy(() => import('./settings')),
    '/setup': lazy(() => import('./setup')),
    '/verify': lazy(() => import('./verify')),
    '*': to ? redirect(to, { exact: false }) : routes,
  })
})

export default compose(
  withView((request, context) => <App navigationContext={context} />),
  routesWithUserRedirects,
)
