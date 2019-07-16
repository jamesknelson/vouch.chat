const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripeConfig, stripe } = require('../util/stripe')

const db = admin.firestore()

exports.getPlan = functions.https.onCall(async (id, context) => {
  let plan = await stripe.plans.retrieve(id)
  return pickers.plan(plan)
})

/**
 * If the user can't currently pick a premium username, then this will return
 * the suggested plan for them to upgrade to.
 */
exports.getUsernameUpgradePlan = functions.https.onCall(
  async (data, context) => {
    let uid = context.auth.uid
    let userSnapshot = await db
      .collection('users')
      .doc(uid)
      .get()
    let user = userSnapshot.data()
    let planId = user.stripeSubscription.plan.id
    let currentPlan = await stripe.plans.retrieve(planId)
    let upgradePlanId = currentPlan.metadata.usernameUpgradePlanId
    if (upgradePlanId) {
      return pickers.plan(await stripe.plans.retrieve(upgradePlanId))
    } else {
      return null
    }
  },
)

exports.getPlans = functions.https.onCall(async (data, context) => {
  return fetchPlans()
})

async function fetchPlans() {
  const { data: plans } = await stripe.plans.list({
    active: true,
    product: stripeConfig.product_id,
    expand: ['data.product'],
  })
  let results = {}
  for (let plan of plans) {
    let entry = Object.entries(plan.product.metadata).find(
      ([_, id]) => id === plan.id,
    )
    if (entry) {
      results[entry[0]] = pickers.plan(plan)
    }
  }
  return results
}
