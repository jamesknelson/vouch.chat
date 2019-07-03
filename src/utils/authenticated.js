import { map, redirect } from 'navi'
import loading from 'routes/loading'

export default function authenticated(matcher) {
  return map((request, context) =>
    // When we're not yet sure whether the user is logged in or not,
    // just show a placeholder
    context.currentUser === undefined
      ? loading
      : !context.currentUser
      ? // If the user is actually logged out, then redirect to the login screen
        redirect(
          '/login?required&redirectTo=' +
            encodeURIComponent(request.originalUrl),
          // By specifying exact: false, the redirect will match *all*
          // urls.
          { exact: false },
        )
      : matcher,
  )
}
