const admin = require('firebase-admin')

const db = admin.firestore()

module.exports = async function topUp(accountRef) {
  await db.runTransaction(async tx => {
    let accountSnapshot = await tx.get(accountRef)

    let {
      availableCasts = 0,
      availableVouches = 0,
      subscription,
    } = accountSnapshot.data()
    let plan = subscription.plan

    await tx.set(
      accountRef,
      {
        availableCasts: availableCasts + parseInt(plan.dailyCasts),
        availableVouches: availableVouches + parseInt(plan.dailyVouches),
        lastTopUpAt: Date.now(),
      },
      {
        merge: true,
      },
    )
  })
}
