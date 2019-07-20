import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

restartSubscription.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function restartSubscription(params, backend) {
  let restartSubscription = backend.functions.httpsCallable(
    'api-restartSubscription',
  )
  let { data } = await restartSubscription()

  if (data.status !== 'success') {
    return normalizeIssues('Something went wrong')
  }
}
