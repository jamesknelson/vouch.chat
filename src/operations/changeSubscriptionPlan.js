import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

changeSubscriptionPlan.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function changeSubscriptionPlan({ planId }, backend) {
  try {
    let changeSubscriptionPlan = backend.functions.httpsCallable(
      'api-changeSubscriptionPlan',
    )
    let { data } = await changeSubscriptionPlan({
      planId,
    })

    if (data.status !== 'success') {
      return normalizeIssues('Something went wrong')
    }
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  }
}
