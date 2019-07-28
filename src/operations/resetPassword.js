import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validatePassword from 'utils/validatePassword'

const passwordErrorMessages = {
  required: 'Please enter your new password.',
  tooShort: 'Your password must have at least 6 letters.',
}

resetPassword.useDependencies = function useDependencies() {
  return useBackend()
}

resetPassword.validate = function validate(params) {
  let passwordIssues = normalizeIssues({
    password: passwordErrorMessages[validatePassword(params.password)],
  })
  if (passwordIssues) {
    return passwordIssues
  }

  if (params.passwordConfirmation !== params.password) {
    return {
      passwordConfirmation: "This doesn't match the password above.",
    }
  }
}

export default async function resetPassword(params, backend) {
  try {
    await backend.auth.confirmPasswordReset(params.code, params.password)
    await backend.auth.signInWithEmailAndPassword(params.email, params.password)
    await backend.currentUser.getCurrentValue()

    // After resetting a user's password, the provider will always be
    // email/password, even if the user first signed up through another
    // provider.
    await backend.deviceConfig.previousLoginProvider.set(null)
  } catch (error) {
    return normalizeIssues(error.message || 'error')
  }
}
