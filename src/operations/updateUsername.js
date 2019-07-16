import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateUsername from 'utils/validateUsername'

updateUsername.useDependencies = function useDependencies() {
  return [useBackend(), useCurrentUser()]
}

updateUsername.validate = async function validate(params, [_, currentUser]) {
  return normalizeIssues({
    username: validateUsername(currentUser, params.username),
  })
}

export default async function updateUsername({ username }, [backend]) {
  try {
    let setUsername = backend.functions.httpsCallable('api-updateUsername')
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
