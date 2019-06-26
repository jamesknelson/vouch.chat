import { auth } from 'firebaseApp'
import { normalizeIssues } from 'utils/Issues'
import validateEmail from 'utils/validateEmail'

const emailErrorMessages = {
  required: 'Who are you, though?',
  invalid: "That email doesn't look quite right.",
}

export function validate(params) {
  return normalizeIssues({
    email: emailErrorMessages[validateEmail(params.email)],
    password: params.password ? undefined : 'You need a password.',
  })
}

export async function invoke(params) {
  let unsubscribe
  try {
    let { user } = await auth.signInWithEmailAndPassword(
      params.email,
      params.password,
    )
    await new Promise((resolve, reject) => {
      unsubscribe = auth.onAuthStateChanged(authUser => {
        if ((authUser && authUser.uid) === (user && user.uid)) {
          // TODO: wrap `auth` with another object that waits for user data to be read in before notifying
          // anyway
          resolve()
        } else if (authUser !== undefined) {
          reject()
        }
      })
    })
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  } finally {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

export default Object.assign(invoke, { validate })
