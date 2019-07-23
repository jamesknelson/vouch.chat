const admin = require('firebase-admin')

const db = admin.firestore()
const topUps = db.collection('topUps')

const oneDay = 24 * 60 * 60 * 1000

function sum(array) {
  return array.reduce((acc, x) => acc + x, 0)
}

/**
 * Add vouches to a user's account. If `forPlanChange: true` is passed in,
 * then it will only add as many vouches as are required to top up the account
 * after an upgrade. Otherwise, it'll add the full amount of planned vouches.
 */
module.exports = async function topUp(
  accountRef,
  { forPlanChange = false } = {},
) {
  let now = Date.now()

  await db.runTransaction(async tx => {
    let uid = accountRef.parent.parent.id
    let [recentTopUpsSnapshot, accountSnapshot] = await Promise.all([
      !forPlanChange
        ? null
        : tx.get(
            topUps.where('uid', '==', uid).where('time', '>=', now - oneDay),
          ),
      tx.get(accountRef),
    ])

    let subtractTodaysVouchesFromPreviousPlan = recentTopUpsSnapshot
      ? sum(recentTopUpsSnapshot.docs.map(doc => doc.data().vouchesAdded))
      : 0

    let {
      availableVouches = 0,
      nextScheduledTopUpAt,
      subscription,
    } = accountSnapshot.data()
    let plan = subscription.plan
    let dailyVouches = parseInt(plan.dailyVouches)
    let vouchesAdded = dailyVouches - subtractTodaysVouchesFromPreviousPlan

    if (vouchesAdded < 1) {
      return
    }

    await Promise.all([
      tx.update(accountRef, {
        availableVouches: availableVouches + vouchesAdded,
        lastTopUpAt: now,
        nextScheduledTopUpAt:
          nextScheduledTopUpAt + (forPlanChange ? 0 : oneDay),
      }),
      tx.create(topUps.doc(), { uid, time: now, vouchesAdded }),
    ])
  })
}
