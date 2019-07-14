import { createURLDescriptor } from 'navi'
import { useCurrentRoute } from 'react-navi'

/**
 * Get a url that passes through any auth-related URL parameters on auth
 * screens, and adds a `redirectTo` parameter on other screens.
 *
 * Defaults to pointing to the "login" screen.
 */
export default function useAuthURL(href) {
  let currentRoute = useCurrentRoute()
  let url = createURLDescriptor(href || '/login')

  let { plan, redirectTo } = currentRoute.url.query
  if (plan || redirectTo) {
    if (plan) {
      url.query.plan = plan
    }
    if (redirectTo) {
      url.query.redirectTo = redirectTo
    }
  } else {
    url.query.redirectTo = currentRoute.url.href
  }

  return url
}
