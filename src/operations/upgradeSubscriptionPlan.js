import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

upgradeSubscriptionPlan.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function upgradeSubscriptionPlan({ planId }, backend) {
  try {
    let upgradeSubscriptionPlan = backend.functions.httpsCallable(
      'api-upgradeSubscriptionPlan',
    )
    let { data } = await upgradeSubscriptionPlan({
      planId,
    })

    if (data.status !== 'success') {
      return normalizeIssues('Something went wrong')
    }
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  }
}
