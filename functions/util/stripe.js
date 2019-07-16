const functions = require('firebase-functions')

const Stripe = require('stripe')
const stripeConfig = functions.config().stripe
const stripe = Stripe(stripeConfig.secret_key)

module.exports = {
  stripe,
  stripeConfig,
}
