const admin = require('firebase-admin')
const functions = require('firebase-functions')
const validateUsernameAvailability = require('./validateUsernameAvailability')

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

    if (!validateUsernameAvailability(username)) {
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

const setUsername = functions.https.onCall(async ({ username }, context) => {
  let uid = context.auth.uid

  username = username.trim().toLowerCase()

  // They're not logged in and this is only used by members so let's just lie
  // to them.
  if (!uid || !username || !UsernamePattern.test(username)) {
    return { status: 'error', code: 400 }
  }

  if (!validateUsernameAvailability(username)) {
    return { status: 'error', code: 'username-unavailable' }
  }

  return db.runTransaction(async tx => {
    let users = db.collection('users')
    let userRef = users.doc(uid)

    let userSnapshot = await tx.get(userRef)
    let user = userSnapshot.data()

    if (!user.premiumUsername && !/\d/.test(username)) {
      return { status: 'error', code: 'premium-username-requires-upgrade' }
    }
    if (user.username === username) {
      return { status: 'success' }
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
  setUsername,
}
