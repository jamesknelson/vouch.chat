import { compose, lazy, mount, redirect, withView } from 'navi'
import React from 'react'
import App from '../App'

export default compose(
  withView((request, context) => <App navigationContext={context} />),
  mount({
    '/': lazy(() => import('./landing')),
    '/messages': lazy(() => import('./messages')),
    '/notifications': lazy(() => import('./notifications')),
    '/pen': lazy(() => import('./pen')),
    '/watch': lazy(() => import('./watch')),
    // '/verify': lazy(() => import('./verify')),
    // '/recover-account': lazy(() => import('./forgotPassword')),
    // '/login': lazy(() => import('./login')),
    '/account': lazy(() => import('./account')),
    '/logout': redirect('/'),
    '/plans': lazy(() => import('./plans')),
    // '/signup': lazy(() => import('./signup')),
    // '/subscribe': lazy(() => import('./subscribe')),
    // '/thankyou': lazy(() => import('./thankyou')),
  }),
)
