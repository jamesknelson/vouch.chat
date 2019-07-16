const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripeConfig, stripe } = require('../util/stripe')

const db = admin.firestore()
const members = db.collection('members')

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
    let accountSnapshot = await members
      .doc(uid)
      .collection('private')
      .doc('account')
      .get()
    let account = accountSnapshot.data()
    let stripePlanId = account.subscription.plan.id
    let currentStripePlan = await stripe.plans.retrieve(stripePlanId)
    let upgradeStripePlanId = currentStripePlan.metadata.usernameUpgradePlanId
    if (upgradeStripePlanId) {
      return pickers.plan(await stripe.plans.retrieve(upgradeStripePlanId))
    } else {
      return null
    }
  },
)

exports.getPlans = functions.https.onCall(async (data, context) => {
  return fetchPlans()
})

async function fetchPlans() {
  const { data: stripePlans } = await stripe.plans.list({
    active: true,
    product: stripeConfig.product_id,
    expand: ['data.product'],
  })
  let results = {}
  for (let stripePlan of stripePlans) {
    let entry = Object.entries(stripePlan.product.metadata).find(
      ([_, id]) => id === stripePlan.id,
    )
    if (entry) {
      results[entry[0]] = pickers.plan(stripePlan)
    }
  }
  return results
}
