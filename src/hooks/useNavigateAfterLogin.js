import { useNavigation } from 'react-navi'

const defaultRedirectTo = '/'

function useNavigateAfterLogin({ defaultURL, plan, redirectTo }) {
  let navigation = useNavigation()

  return async () => {
    if (plan) {
      let oldRedirectTo = redirectTo
      redirectTo = `/payment?plan=${plan}`
      if (oldRedirectTo) {
        redirectTo += `&redirectTo=${encodeURIComponent(redirectTo)}`
      }
    } else if (!redirectTo) {
      redirectTo = '/'
    }

    // Find the default `redirectTo` here instead of in the function
    // arguments, as otherwise the `redirecting` message will always
    // be displayed.
    await navigation.navigate(redirectTo || defaultURL || defaultRedirectTo)
  }
}

export default useNavigateAfterLogin
