import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateEmail from 'utils/validateEmail'

const emailErrorMessages = {
  required: 'You need to enter an email address.',
  invalid: "That email doesn't look quite right.",
}

updateAccountDetails.useDependencies = function useDependencies() {
  return useBackend()
}

updateAccountDetails.validate = function validate(params) {
  return normalizeIssues({
    email: emailErrorMessages[validateEmail(params.email)],
    username: params.username ? undefined : 'You need a username.',
  })
}

export default async function updateAccountDetails(params, backend) {
  return normalizeIssues('Not implemented.')
}
