const admin = require('firebase-admin')
const functions = require('firebase-functions')
const renderer = require('./renderer')

const serviceAccount = require('./.serviceaccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

exports.renderer = functions.https.onRequest(renderer)

exports.api = {
  ...require('./api/cancelSubscription'),
  ...require('./api/changeSubscriptionPlan'),
  ...require('./api/createFreeAccount'),
  ...require('./api/payAndSubscribe'),
  ...require('./api/plans'),
  ...require('./api/removeBillingCard'),
  ...require('./api/restartSubscription'),
  ...require('./api/updateBillingCard'),
  ...require('./api/usernames'),
}

exports.jobs = {
  ...require('./jobs/runScheduledTopUps'),
}

exports.webhooks = {
  ...require('./webhooks/stripe'),
}
