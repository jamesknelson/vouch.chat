import { createURLDescriptor } from 'navi'
import React from 'react'
import { Link, useCurrentRoute } from 'react-navi'

/**
 * A link that passes through any auth-related URL parameters on auth screens,
 * and adds a `redirectTo` parameter on other screens.
 *
 * Defaults to pointing to the "login" screen.
 */
function AuthLink(props) {
  let currentRoute = useCurrentRoute()
  let url = createURLDescriptor(props.href || '/login')

  if (currentRoute.data.auth) {
    Object.assign(url.query, currentRoute.url.query)
  } else {
    url.query.redirectTo = currentRoute.url.href
  }

  return <Link {...props} href={url} />
}

export default AuthLink
