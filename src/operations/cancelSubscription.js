import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

cancelSubscription.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function cancelSubscription(params, backend) {
  let cancelSubscription = backend.functions.httpsCallable(
    'api-cancelSubscription',
  )
  let { data } = await cancelSubscription()

  if (data.status !== 'success') {
    return normalizeIssues('Something went wrong')
  }
}
