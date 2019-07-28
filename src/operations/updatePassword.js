import { useBackend } from 'context'
import firebase from 'firebase/app'
import { normalizeIssues } from 'utils/Issues'
import validatePassword from 'utils/validatePassword'

const passwordErrorMessages = {
  required: 'Please enter your password.',
  tooShort: 'Your password must have at least 6 letters.',
}

updatePassword.useDependencies = function useDependencies() {
  return useBackend()
}

updatePassword.validate = function validate(params) {
  return normalizeIssues({
    currentPassword: !params.currentPassword
      ? 'Please enter your current password.'
      : undefined,
    password: passwordErrorMessages[validatePassword(params.password)],
    passwordConfirmation:
      (params.password &&
        (!params.passwordConfirmation
          ? 'Please enter a confirmation password'
          : params.password !== params.passwordConfirmation &&
            "This doesn't match the above password.")) ||
      undefined,
  })
}

export default async function updatePassword(params, backend) {
  try {
    let userCredential = firebase.auth.EmailAuthProvider.credential(
      backend.auth.currentUser.email,
      params.currentPassword,
    )

    try {
      await backend.auth.currentUser.reauthenticateWithCredential(
        userCredential,
      )
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        return { currentPassword: "This doesn't match your password." }
      } else {
        throw error
      }
    }

    await backend.auth.currentUser.updatePassword(params.password)
  } catch (error) {
    return normalizeIssues(error.message || 'error')
  }
}
