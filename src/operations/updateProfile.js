import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

const errorMessages = {
  required: 'You need to enter something here.',
}

updateProfile.useDependencies = function useDependencies() {
  return useBackend()
}

updateProfile.validate = function validate(params) {
  return normalizeIssues({
    displayName: !params.displayName ? errorMessages.required : undefined,
  })
}

export default async function updateProfile(params, backend) {
  return normalizeIssues('Not implemented.')
}
