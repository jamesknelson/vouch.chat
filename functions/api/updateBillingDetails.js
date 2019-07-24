const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')

const db = admin.firestore()
const members = db.collection('members')

exports.updateBillingDetails = functions.https.onCall(async (data, context) => {
  let email = context.auth.token.email
  let uid = context.auth.uid
  let accountRef = members
    .doc(uid)
    .collection('private')
    .doc('account')
  let accountSnapshot = await accountRef.get()
  let account = accountSnapshot.exists ? accountSnapshot.data() : {}
  let stripeCustomerId = account.stripeCustomerId

  // Override any old/broken customer ids
  if (stripeCustomerId) {
    try {
      let { deleted } = await stripe.customers.retrieve(stripeCustomerId)
      if (deleted) {
        stripeCustomerId = null
      }
    } catch (e) {
      stripeCustomerId = null
    }
  }

  // Try setting up payment source for customer
  let stripeCustomer
  try {
    if (!stripeCustomerId) {
      stripeCustomer = await stripe.customers.create({
        expand: ['default_source'],
        preferred_locales: [data.language],
        source: data.token,
        email: email,
        name: data.name,
        tax_exempt: data.country !== 'JP' ? 'exempt' : 'none',
        metadata: {
          country: data.country,
        },
      })

      stripeCustomerId = stripeCustomer.id

      await accountRef.set(
        {
          stripeCustomerId,
          card: pickers.card(stripeCustomer.default_source),
          country: data.country,
        },
        { merge: true },
      )
    } else {
      stripeCustomer = await stripe.customers.update(stripeCustomerId, {
        expand: ['default_source'],
        preferred_locales: [data.language],
        source: data.token,
        tax_exempt: data.country !== 'JP' ? 'exempt' : 'none',
        metadata: {
          country: data.country,
        },
      })
      await accountRef.update({
        card: pickers.card(stripeCustomer.default_source),
        country: data.country,
      })
    }
    return { status: 'success' }
  } catch (error) {
    console.error(error)
    return { status: 'error', error }
  }
})
