import { useBackend } from 'context'
import firebase from 'firebase/app'
import normalizeIssues from 'utils/Issues'

socialLogin.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function socialLogin({ providerName }, backend) {
  try {
    let provider = new firebase.auth[providerName]()
    provider.addScope('email')
    await backend.auth.signInWithRedirect(provider)
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  }
}
