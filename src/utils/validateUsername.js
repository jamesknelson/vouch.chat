import debounce from 'debounce-promise'

const debounceTime = 500
const debouncedIsAvailables = new WeakMap()

export default async function validateUsername(backend, user, username) {
  if (user.username === username) {
    return
  }

  if (!username) {
    return 'required'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'invalid'
  } else if (username.length > 15) {
    return 'long'
  }

  // Create a debounced checker and attach it to the backend via a weakmap,
  // so that it'll only exist for the duration of this request on the server.
  let debouncedIsAvailable = debouncedIsAvailables.get(backend)
  if (!debouncedIsAvailable) {
    let isUsernameAvailable = backend.functions.httpsCallable(
      'api-isUsernameAvailable',
    )
    let getIsAvailable = async username => {
      let { data } = await isUsernameAvailable({ username })
      return data
    }
    debouncedIsAvailable = debounce(getIsAvailable, debounceTime)
    debouncedIsAvailables.set(backend, debouncedIsAvailable)
  }

  let isAvailable = await debouncedIsAvailable(username)
  if (!isAvailable) {
    return 'username-taken'
  }

  // This should be the last test as we don't want to recommend that people
  // upgrade their plan if the username won't work.
  if (
    (!user.subscription || !user.subscription.plan.premiumUsername) &&
    !/\d/.test(username)
  ) {
    return 'premium'
  }
}
