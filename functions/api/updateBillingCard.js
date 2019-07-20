const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')

const db = admin.firestore()
const members = db.collection('members')

exports.updateBillingCard = functions.https.onCall(async (params, context) => {
  let uid = context.auth.uid
  let accountRef = members
    .doc(uid)
    .collection('private')
    .doc('account')
  let accountSnapshot = await accountRef.get()
  let account = accountSnapshot.data()
  let stripeCustomerId = account.stripeCustomerId

  try {
    let stripeCustomer = await stripe.customers.update(stripeCustomerId, {
      expand: ['default_source'],
      preferred_locales: [params.language],
      source: params.token,
      tax_exempt: params.country !== 'JP' ? 'exempt' : 'none',
      metadata: {
        country: params.country,
      },
    })
    await accountRef.update({
      card: pickers.card(stripeCustomer.default_source),
      country: params.country,
    })
    return {
      status: 'success',
    }
  } catch (error) {
    console.error(error)
    return { status: 'error', error }
  }
})
