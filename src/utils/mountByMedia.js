import { map } from 'navi'

export default function mountByMedia({ default: route, ...mediaRoutes }) {
  return map(({ context }) => {
    if (!context.ssr) {
      for (let mediaQuery of Object.keys(mediaRoutes)) {
        if (window.matchMedia(mediaQuery).matches) {
          return mediaRoutes[mediaQuery]
        }
      }
    }
    return route
  })
}
