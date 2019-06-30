import { useBackend } from 'context'
import firebase from 'firebase/app'
import normalizeIssues from 'utils/Issues'

socialLogin.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function socialLogin({ providerName }, backend) {
  try {
    let provider = new firebase.auth[providerName]()
    let userCredential = await backend.auth.signInWithPopup(provider)
    let firebaseUser = userCredential.user
    let dbUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      isNewUser: userCredential.additionalUserInfo.isNewUser,
      originalProviderId: userCredential.additionalUserInfo.providerId,
      displayName:
        firebaseUser.displayName === null
          ? undefined
          : firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    }

    if (dbUser.isNewUser) {
      await backend.db
        .collection('users')
        .doc(dbUser.uid)
        .set(dbUser, { merge: true })
    }

    await backend.currentUser.getCurrentValue()
    await backend.deviceConfig.previousLoginProvider.set(providerName)
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  }
}
