import { normalizeIssues } from 'utils/Issues'
import validateEmail from '../utils/validateEmail'
import validatePassword from '../utils/validatePassword'
import { useBackend } from 'context'

const emailErrorMessages = {
  required: 'Who are you, though?',
  invalid: "That email doesn't look quite right.",
}

const passwordErrorMessages = {
  required: "You'll need to set a password",
  tooShort: 'Your password must have at least 6 letters.',
}

emailRegister.useDependencies = function useDependencies() {
  return useBackend()
}

emailRegister.validate = function validate(params) {
  return normalizeIssues({
    email: emailErrorMessages[validateEmail(params.email)],
    name: params.name ? undefined : "Won't you please tell me your name?",
    password: passwordErrorMessages[validatePassword(params.password)],
  })
}

export default async function emailRegister(params, backend) {
  try {
    let userCredential = await backend.auth.createUserWithEmailAndPassword(
      params.email,
      params.password,
    )
    let firebaseUser = userCredential.user
    let dbUser = {
      contactEmail: params.email,
      displayName: params.name,
    }

    let dbUpdatePromise = backend.db
      .collection('users')
      .doc(firebaseUser.uid)
      .set(dbUser, { merge: true })

    let profileUpdatePromise = backend.auth.currentUser.updateProfile({
      displayName: params.name,
    })

    // Send email verification *after* updating display name
    backend.auth.currentUser.sendEmailVerification()

    await Promise.all([dbUpdatePromise, profileUpdatePromise])
    await backend.currentUser.getCurrentValue()
    await backend.deviceConfig.previousLoginProvider.set(null)
  } catch (error) {
    return error.message || 'Something went wrong'
  }
}
