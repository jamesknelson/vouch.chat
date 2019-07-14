import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

chooseFreePlan.useDependencies = function useDependencies() {
  return useBackend()
}

chooseFreePlan.validate = function validate(params, backend) {
  // this should fail if the user already has a plan.
  // instead of picking the free plan, you'll want to cancel the existing plan.
}

export default async function chooseFreePlan(params, backend) {
  // set user.hasChosenPlan
  // no special access control needed for this, so can just use db

  return normalizeIssues('Not implemented.')
}
