const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')

const db = admin.firestore()
const members = db.collection('members')

exports.removeBillingCard = functions.https.onCall(async (params, context) => {
  let uid = context.auth.uid
  let accountRef = members
    .doc(uid)
    .collection('private')
    .doc('account')
  let accountSnapshot = await accountRef.get()
  let account = accountSnapshot.data()
  let { stripeCustomerId, subscription } = account

  if (
    subscription &&
    subscription.status === 'active' &&
    !subscription.cancelAtPeriodEnd
  ) {
    return {
      status: 'success',
      code: 'active-subscription-requires-card',
    }
  }

  let stripeCustomer = await stripe.customers.retrieve(stripeCustomerId)
  await stripe.customers.deleteSource(
    stripeCustomerId,
    stripeCustomer.default_source,
  )
  accountRef.update({
    card: null,
  })
  return {
    status: 'success',
  }
})
