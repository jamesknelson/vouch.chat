import firebase from 'firebase/app'
import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateEmail from 'utils/validateEmail'

const emailErrorMessages = {
  required: 'You need to enter an email address.',
  invalid: "That email doesn't look quite right.",
}

updateEmail.useDependencies = function useDependencies() {
  return [useBackend(), useCurrentUser()]
}

updateEmail.validate = function validate({ email }) {
  return normalizeIssues({
    email: emailErrorMessages[validateEmail(email)],
  })
}

export default async function updateEmail(
  { email: newEmail, password: currentPassword },
  [backend, currentUser],
) {
  if (newEmail === currentUser.email) {
    return
  }

  let userCredential = firebase.auth.EmailAuthProvider.credential(
    currentUser.email,
    currentPassword,
  )

  try {
    await backend.auth.currentUser.reauthenticateWithCredential(userCredential)
    await backend.auth.currentUser.updateEmail(newEmail)
    await backend.auth.currentUser.sendEmailVerification()
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      return normalizeIssues({ password: 'wrong' })
    } else if (error.code === 'auth/email-already-in-use') {
      return normalizeIssues({ email: 'taken' })
    } else {
      return normalizeIssues('Something went wrong')
    }
  }
}
