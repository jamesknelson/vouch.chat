const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')

const db = admin.firestore()
const members = db.collection('members')

exports.restartSubscription = functions.https.onCall(
  async (params, context) => {
    let uid = context.auth.uid
    let accountRef = members
      .doc(uid)
      .collection('private')
      .doc('account')
    let accountSnapshot = await accountRef.get()
    let account = accountSnapshot.data()
    let { subscription } = account

    if (!subscription) {
      return {
        status: 'error',
        code: 'no-subscription-to-restart',
      }
    }

    // Double check that things haven't gotten out of sync
    let stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeId,
    )
    if (stripeSubscription.status !== 'active') {
      return {
        status: 'error',
        code: 'no-subscription-to-restart',
      }
    }
    if (!stripeSubscription.cancel_at_period_end) {
      return {
        status: 'error',
        code: 'already-active',
      }
    }

    stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeId,
      {
        cancel_at_period_end: false,
      },
    )
    await accountRef.update({
      subscription: pickers.subscription(stripeSubscription),
    })
    return {
      status: 'success',
    }
  },
)
