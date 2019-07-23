const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe, stripeConfig } = require('../util/stripe')

const db = admin.firestore()
const privateCollections = db.collectionGroup('private')

exports.stripe = functions.https.onRequest(async (request, response) => {
  let signature = request.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      stripeConfig.webhook_secret,
    ) // Validate the request
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`)
  }

  // eslint-disable-next-line default-case
  switch (event.type) {
    case 'invoice.created':
      await invoiceCreated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await customerSubscriptionDeleted(event.data.object)
      break
    case 'customer.subscription.updated':
      await customerSubscriptionUpdated(event.data.object)
      break
  }

  return response.json({ received: true })
})

async function getStripeSubscriptionAccountRef(stripeSubscription) {
  let snapshots = await privateCollections
    .where('subscription.stripeId', '==', stripeSubscription.id)
    .get()
  let snapshot = snapshots.docs[0]
  let accountSnapshot = snapshot && snapshot.id === 'account' ? snapshot : null
  if (accountSnapshot) {
    return accountSnapshot.ref
  }
}

async function invoiceCreated(stripeInvoice) {
  // Do nothing. Stripe requires a handler for this webhook.
  // https://stripe.com/docs/billing/webhooks#understand
}

async function customerSubscriptionDeleted(stripeSubscription) {
  let accountRef = await getStripeSubscriptionAccountRef(stripeSubscription)
  if (accountRef) {
    await accountRef.update({
      subscription: null,
    })
  }
}

async function customerSubscriptionUpdated(stripeSubscription) {
  let accountRef = await getStripeSubscriptionAccountRef(stripeSubscription)
  if (accountRef) {
    await accountRef.update({
      subscription: pickers.subscription(stripeSubscription),
    })
  }
}
