const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripeConfig, stripe } = require('../util/stripe')

exports.getPlan = functions.https.onCall(async (id, context) => {
  let plan = await stripe.plans.retrieve(id)
  return pickers.plan(plan)
})

exports.getPlans = functions.https.onCall(async (data, context) => {
  return fetchPlans()
})

async function fetchPlans() {
  const { data: stripePlans } = await stripe.plans.list({
    active: true,
    product: stripeConfig.product_id,
    expand: ['data.product'],
  })
  let product = stripePlans[0].product
  let publicPlanIds = product.metadata.publicPlanIds.split(/\s*,\s*/g)
  let results = []
  for (let stripePlan of stripePlans) {
    if (publicPlanIds.includes(stripePlan.id)) {
      results.push(pickers.plan(stripePlan))
    }
  }
  return results
}
