import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'

chooseFreePlan.useDependencies = function useDependencies() {
  return [useCurrentUser(), useBackend()]
}

chooseFreePlan.validate = function validate(params, [currentUser]) {
  if (currentUser.hasActiveSubscription) {
    return normalizeIssues(
      "You've already signed up for a wig. You can cancel it from the account settings page.",
    )
  }
}

export default async function chooseFreePlan(params, [currentUser, backend]) {
  try {
    await backend.db
      .collection('users')
      .doc(currentUser.uid)
      .update({ hasChosenPlan: true })
  } catch (error) {
    return error.message || 'Something went wrong'
  }
}
