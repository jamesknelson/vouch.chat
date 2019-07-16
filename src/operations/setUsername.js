import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateUsername from 'utils/validateUsername'

setUsername.useDependencies = function useDependencies() {
  return [useBackend(), useCurrentUser()]
}

setUsername.validate = async function validate(params, [_, currentUser]) {
  return normalizeIssues({
    username: validateUsername(currentUser, params.username),
  })
}

export default async function setUsername({ username }, [backend]) {
  try {
    let setUsername = backend.functions.httpsCallable('api-setUsername')
    let { data } = await setUsername({ username })

    if (data.status !== 'success') {
      return normalizeIssues(
        data.code || data.message || 'Something went wrong',
      )
    }
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  }
}
