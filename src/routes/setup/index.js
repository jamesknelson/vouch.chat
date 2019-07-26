import { mount, lazy, redirect } from 'navi'

export default mount({
  '/subscribe': lazy(() => import('./subscribe')),
  '/verify': lazy(() => import('./verifyEmail')),
  '/username': lazy(() => import('./username')),

  '/profile': redirect('/settings/profile'),

  // TODO:
  // '/profile': lazy(() => import('./profile')),
  // '/first-cast': route({
  //   view: <div>What if I told you</div>,
  // }),
})
