import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateEmail from 'utils/validateEmail'

const emailErrorMessages = {
  required: 'Who are you, though?',
  invalid: "That email doesn't look quite right.",
}

sendPasswordResetEmail.useDependencies = function useDependencies() {
  return useBackend()
}

sendPasswordResetEmail.validate = function validate(params) {
  return normalizeIssues({
    email: emailErrorMessages[validateEmail(params.email)],
  })
}

export default async function sendPasswordResetEmail(params, backend) {
  try {
    await backend.auth.sendPasswordResetEmail(params.email)
  } catch (error) {
    return normalizeIssues({ email: error.message || 'error' })
  }
}
