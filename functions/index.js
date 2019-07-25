const admin = require('firebase-admin')
const functions = require('firebase-functions')
const renderer = require('./renderer')

const serviceAccount = require('./.serviceaccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:
    process.env.FIREBASE_CONFIG.storageBucket || 'vouchchat.appspot.com',
})

exports.renderer = functions.https.onRequest(renderer)

exports.api = {
  ...require('./api/cancelSubscription'),
  ...require('./api/createFreeAccount'),
  ...require('./api/deleteUser'),
  ...require('./api/plans'),
  ...require('./api/removeBillingCard'),
  ...require('./api/subscribeToPlan'),
  ...require('./api/updateBillingDetails'),
  ...require('./api/usernames'),
}

exports.jobs = {
  ...require('./jobs/runScheduledTopUps'),
}

exports.webhooks = {
  ...require('./webhooks/stripe'),
}
