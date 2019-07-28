import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

sendVerificationEmail.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function sendVerificationEmail(_, backend) {
  try {
    await backend.auth.currentUser.sendEmailVerification()
  } catch (error) {
    return normalizeIssues({ email: error.message || 'error' })
  }
}
