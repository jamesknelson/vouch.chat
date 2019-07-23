const admin = require('firebase-admin')
const functions = require('firebase-functions')
const topUp = require('../util/topUp')

const db = admin.firestore()
const privateCollections = db.collectionGroup('private')

// Run at the top of every hour
exports.runScheduledTopUps = functions.pubsub
  .schedule('0 * * * *')
  .onRun(async context => {
    // Find all active accounts that are scheduled for a top up this hour
    let querySnapshot = await privateCollections
      .where('subscription.status', '==', 'active')
      .where('nextScheduledTopUpAt', '<=', Date.now())
      .get()

    for (let accountRef of querySnapshot.docs) {
      await topUp(accountRef.ref)
    }
  })
