const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { stripe } = require('../util/stripe')

const auth = admin.auth()
const storage = admin.storage()
const bucket = storage.bucket()
const db = admin.firestore()
const members = db.collection('members')

exports.deleteUser = functions.https.onCall(async (params, context) => {
  let uid = context.auth.uid
  let memberRef = members.doc(uid)
  let privateRef = memberRef.collection('private')
  let privateDocsRef = await privateRef.get()
  let accountSnapshot = await privateRef.doc('account').get()
  let account = accountSnapshot.exists ? accountSnapshot.data() : {}
  let { subscription } = account

  await db.runTransaction(async tx => {
    if (subscription) {
      await stripe.subscriptions.del(subscription.stripeId)
    }
    for (let doc of privateDocsRef.docs) {
      await tx.delete(doc.ref)
    }
    await tx.delete(memberRef)
    await auth.deleteUser(uid)
    try {
      await bucket.deleteFiles({
        prefix: `avatars/${uid}`,
      })
    } catch (e) {}
  })

  return { status: 'success' }
})
