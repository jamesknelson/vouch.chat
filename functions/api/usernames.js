const admin = require('firebase-admin')
const functions = require('firebase-functions')
const isReservedUsername = require('../util/isReservedUsername')

const db = admin.firestore()

const UsernamePattern = /^[a-zA-Z0-9_]{1,15}$/

const isUsernameAvailable = functions.https.onCall(
  async ({ username }, context) => {
    let uid = context.auth.uid

    username = username.trim().toLowerCase()

    // They're not logged in and this is only used by members so let's just lie
    // to them.
    if (!uid || !username || !UsernamePattern.test(username)) {
      return true
    }

    if (!isReservedUsername(username)) {
      return false
    }

    let results = await db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get()

    return !!results.empty
  },
)

const updateUsername = functions.https.onCall(async ({ username }, context) => {
  let uid = context.auth.uid

  username = username.trim().toLowerCase()

  // They're not logged in and this is only used by members so let's just lie
  // to them.
  if (!uid || !username || !UsernamePattern.test(username)) {
    return { status: 'error', code: 400 }
  }

  if (!isReservedUsername(username)) {
    return { status: 'error', code: 'username-taken' }
  }

  return db.runTransaction(async tx => {
    let users = db.collection('users')
    let userRef = users.doc(uid)

    let userSnapshot = await tx.get(userRef)
    let user = userSnapshot.data()

    if (
      (!user.stripeSubscription ||
        !user.stripeSubscription.plan.metadata.premiumUsername) &&
      !/\d/.test(username)
    ) {
      return { status: 'error', code: 'premium-username-requires-upgrade' }
    }
    if (user.username === username) {
      return { status: 'success' }
    }

    // Don't allow password-based accounts to take a username until they've
    // verified their email address or made a payment
    let authUser = await admin.auth().getUser(uid)
    let providerId = authUser.providerData[0].providerId
    if (
      providerId === 'password' &&
      !authUser.emailVerified &&
      !(user.stripeSubscription && user.stripeSubscription.status === 'active')
    ) {
      return { status: 'error', code: 'verification-required' }
    }

    let usernameQuery = users.where('username', '==', username).limit(1)
    let matchingUsers = await tx.get(usernameQuery)
    if (!matchingUsers.empty) {
      return { status: 'error', code: 'username-taken' }
    }

    tx.set(userRef, { username }, { merge: true })

    return { status: 'success' }
  })
})

module.exports = {
  isUsernameAvailable,
  updateUsername,
}
