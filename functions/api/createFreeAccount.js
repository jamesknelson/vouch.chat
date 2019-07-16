const admin = require('firebase-admin')
const functions = require('firebase-functions')

const db = admin.firestore()
const members = db.collection('members')

exports.createFreeAccount = functions.https.onCall(async (params, context) => {
  let uid = context.auth.uid
  let accountRef = members
    .doc(uid)
    .collection('private')
    .doc('account')

  await accountRef.set({ hasChosenPlan: true }, { merge: true })
})
