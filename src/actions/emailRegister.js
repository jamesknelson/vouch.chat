import { auth, db } from '../firebaseApp'
import { normalizeIssues } from 'utils/Issues'
import validateEmail from '../utils/validateEmail'

export function validate(params) {
  return normalizeIssues({
    email: validateEmail(params.email),
    name: params.name ? undefined : 'required',
    password: params.password ? undefined : 'required',
  })
}

export async function invoke(params) {
  try {
    await auth.createUserWithEmailAndPassword(params.email, params.password)

    // Send email verification *after* updating display name
    auth.currentUser.sendEmailVerification()

    await auth.currentUser.updateProfile({
      displayName: params.name,
    })
  } catch (error) {
    return error.message || 'Something went wrong'
  }
}

export default Object.assign(invoke, { validate })
