import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'

deleteUser.useDependencies = function useDependencies() {
  return [useBackend(), useCurrentUser()]
}

deleteUser.validate = function validate(params, [_, currentUser]) {
  return normalizeIssues({
    username: !params.username
      ? 'Please confirm the account username that you want to delete.'
      : params.username !== currentUser.username
      ? "That isn't your account name."
      : undefined,
  })
}

export default async function deleteUser(params, [backend]) {
  let deleteUser = backend.functions.httpsCallable('api-deleteUser')
  let { data } = await deleteUser()

  if (data.status !== 'success') {
    return normalizeIssues('error')
  }

  await backend.auth.signOut()
}
