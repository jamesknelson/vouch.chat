const admin = require('firebase-admin')

const db = admin.firestore()

module.exports = async function topUp(uid) {
  let userRef = db.collection('users').doc(uid)

  await db.runTransaction(async tx => {
    let userSnapshot = await tx.get(userRef)

    let {
      availableCasts = 0,
      availableVouches = 0,
      stripeSubscription,
    } = userSnapshot.data()
    let planMetadata = stripeSubscription.plan.metadata

    await tx.set(
      userRef,
      {
        availableCasts: availableCasts + parseInt(planMetadata.dailyCasts),
        availableVouches:
          availableVouches + parseInt(planMetadata.dailyVouches),
        lastTopUpAt: Date.now(),
      },
      {
        merge: true,
      },
    )
  })
}
