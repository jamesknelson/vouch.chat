import { compose, lazy, map, mount, redirect, withView } from 'navi'
import React from 'react'
import App from 'App'

export default compose(
  withView((request, context) => <App navigationContext={context} />),
  mount({
    '/': lazy(() => import('./landing')),
    '/messages': lazy(() => import('./messages')),
    '/notifications': lazy(() => import('./notifications')),
    '/share': lazy(() => import('./share')),
    '/read': lazy(() => import('./readingList')),
    '/explore': lazy(() => import('./explore')),
    // '/verify': lazy(() => import('./verify')),
    '/recover': lazy(() => import('./recover')),
    '/settings': lazy(() => import('./settings')),
    '/login': lazy(() => import('./login')),
    '/join': lazy(() => import('./join')),
    '/logout': map(async ({ context }) => {
      await context.backend.auth.signOut()
      return redirect('/')
    }),
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
    '/verify': lazy(() => import('./verify')),
    // '/subscribe': lazy(() => import('./subscribe')),
    // '/thankyou': lazy(() => import('./thankyou')),
  }),
)
