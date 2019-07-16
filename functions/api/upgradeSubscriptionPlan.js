const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')
const topUp = require('../util/topUp')

const db = admin.firestore()

exports.upgradeSubscriptionPlan = functions.https.onCall(
  async ({ planId }, context) => {
    let uid = context.auth.uid
    let userDoc = db.collection('users').doc(uid)
    let userSnapshot = await userDoc.get()
    let user = await userSnapshot.data()
    let { stripeSubscription } = user

    try {
      let subscription = await stripe.subscriptions.update(
        stripeSubscription.id,
        {
          expand: ['plan'],
          plan: planId,
        },
      )
      await userDoc.update({
        stripeSubscription: pickers.subscription(subscription),
      })
      await topUp(userDoc.id)
      return {
        status: 'success',
      }
    } catch (error) {
      return { status: 'error', error }
    }
  },
)
