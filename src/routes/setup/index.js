import React from 'react'
import { mount, lazy, route } from 'navi'

export default mount({
  '/plan': lazy(() => import('./plan')),
  '/payment': lazy(() => import('./payment')),
  '/username': lazy(() => import('./username')),
  '/profile': lazy(() => import('./profile')),
  '/free-cast': route({
    view: <div>What if I told you</div>,
  }),
  '/thanks': route({
    view: (
      <div>
        We{' '}
        <span role="img" aria-label="love">
          ❤️
        </span>{' '}
        you
      </div>
    ),
  }),
})
