import React from 'react'
import { Link } from 'react-navi'

import useAuthURL from 'hooks/useAuthURL'

/**
 * A link that passes through any auth-related URL parameters on auth screens,
 * and adds a `redirectTo` parameter on other screens.
 *
 * Defaults to pointing to the "login" screen.
 */
function AuthLink({ href, ...rest }) {
  let url = useAuthURL(href)
  return <Link {...rest} href={url} />
}

export default AuthLink
