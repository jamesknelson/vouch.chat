const admin = require('firebase-admin')
const functions = require('firebase-functions')
const isReservedUsername = require('../util/isReservedUsername')

const db = admin.firestore()
const members = db.collection('members')

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

    let results = await members
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
    let memberRef = members.doc(uid)

    let accountSnapshot = await tx.get(
      members
        .doc(uid)
        .collection('private')
        .doc('account'),
    )
    let account = accountSnapshot.data()

    if (
      (!account.subscription || !account.subscription.plan.premiumUsername) &&
      !/\d/.test(username)
    ) {
      return { status: 'error', code: 'premium-username-requires-upgrade' }
    }
    if (account.username === username) {
      return { status: 'success' }
    }

    // Don't allow password-based accounts to take a username until they've
    // verified their email address or made a payment
    let user = await admin.auth().getUser(uid)
    let providerId = user.providerData[0].providerId
    if (
      providerId === 'password' &&
      !user.emailVerified &&
      !(account.subscription && account.subscription.status === 'active')
    ) {
      return { status: 'error', code: 'verification-required' }
    }

    let usernameQuery = members.where('username', '==', username).limit(1)
    let matchingMembers = await tx.get(usernameQuery)
    if (!matchingMembers.empty) {
      return { status: 'error', code: 'username-taken' }
    }

    tx.set(memberRef, { username }, { merge: true })

    return { status: 'success' }
  })
})

module.exports = {
  isUsernameAvailable,
  updateUsername,
}
