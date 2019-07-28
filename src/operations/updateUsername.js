import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateUsername from 'utils/validateUsername'

updateUsername.useDependencies = function useDependencies() {
  return [useBackend(), useCurrentUser()]
}

updateUsername.validate = async function validate(
  params,
  [backend, currentUser],
) {
  return normalizeIssues({
    username: await validateUsername(backend, currentUser, params.username),
  })
}

export default async function updateUsername(
  { username },
  [backend, currentUser],
) {
  if (currentUser.username === username) {
    return
  }

  try {
    let setUsername = backend.functions.httpsCallable('api-updateUsername')
    let { data } = await setUsername({ username })

    if (data.status !== 'success') {
      return normalizeIssues(data.code || data.message || 'error')
    }
  } catch (error) {
    return normalizeIssues(error.message || 'error')
  }
}
