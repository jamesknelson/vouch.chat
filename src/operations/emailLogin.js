import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateEmail from 'utils/validateEmail'

const emailErrorMessages = {
  required: 'Who are you, though?',
  invalid: "That email doesn't look quite right.",
}

emailLogin.useDependencies = function useDependencies() {
  return useBackend()
}

emailLogin.validate = function validate(params) {
  return normalizeIssues({
    email: emailErrorMessages[validateEmail(params.email)],
    password: params.password ? undefined : 'You need a password.',
  })
}

export default async function emailLogin(params, backend) {
  try {
    await backend.auth.signInWithEmailAndPassword(params.email, params.password)
    await backend.currentUser.getCurrentValue()
    await backend.deviceConfig.previousLoginProvider.set(null)
  } catch (error) {
    return normalizeIssues(error.message || 'error')
  }
}
