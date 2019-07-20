const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')

const db = admin.firestore()
const members = db.collection('members')

exports.cancelSubscription = functions.https.onCall(async (params, context) => {
  let uid = context.auth.uid
  let accountRef = members
    .doc(uid)
    .collection('private')
    .doc('account')
  let accountSnapshot = await accountRef.get()
  let account = accountSnapshot.data()
  let { subscription } = account

  try {
    let stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeId,
      {
        cancel_at_period_end: true,
      },
    )
    await accountRef.update({
      subscription: pickers.subscription(stripeSubscription),
    })
    return {
      status: 'success',
    }
  } catch (error) {
    console.error(error)
    return { status: 'error', error }
  }
})
