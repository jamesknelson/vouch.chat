const admin = require('firebase-admin')
const functions = require('firebase-functions')
const Stripe = require('stripe')

const stripeConfig = functions.config().stripe
const db = admin.firestore()
const stripe = Stripe(stripeConfig.secret_key)

const changePlan = functions.https.onCall(async (data, context) => {
  let uid = context.auth.uid
  let userDoc = db.collection('users').doc(uid)
  let userSnapshot = await userDoc.get()
  let user = await userSnapshot.data()
  let { stripeSubscription } = user

  try {
    let subscription = await stripe.subscriptions.update(
      stripeSubscription.id,
      {
        expand: ['plan'],
        plan: data.planId,
      },
    )
    await userDoc.update({
      stripeSubscription: subscription,
    })
    return {
      status: 'success',
      data: _pickPublicSubscriptionData(subscription),
    }
  } catch (error) {
    return { status: 'error', error }
  }
})

const cancelSubscription = functions.https.onCall(async (data, context) => {
  let uid = context.auth.uid
  let userDoc = db.collection('users').doc(uid)
  let userSnapshot = await userDoc.get()
  let user = await userSnapshot.data()
  let { stripeSubscription } = user

  try {
    let subscription = await stripe.subscriptions.update(
      stripeSubscription.id,
      {
        cancel_at_period_end: true,
      },
    )
    await userDoc.update({
      stripeSubscription: subscription,
    })
    return {
      status: 'success',
      data: _pickPublicSubscriptionData(subscription),
    }
  } catch (error) {
    return { status: 'error', error }
  }
})

const updateCard = functions.https.onCall(async (data, context) => {
  let uid = context.auth.uid
  let userDoc = db.collection('users').doc(uid)
  let userSnapshot = await userDoc.get()
  let user = await userSnapshot.data()
  let stripeCustomerId = user.stripeCustomerId

  try {
    let customer = await stripe.customers.update(stripeCustomerId, {
      expand: ['default_source'],
      preferred_locales: [data.language],
      source: data.token,
      tax_exempt: data.country !== 'JP' ? 'exempt' : 'none',
      metadata: {
        country: data.country,
      },
    })
    await userDoc.update({
      country: data.country,
    })
    return {
      status: 'success',
      card: _pickPublicCardData(customer.default_source),
    }
  } catch (error) {
    return { status: 'error', error }
  }
})

const getBillingDetails = functions.https.onCall(async (data, context) => {
  let uid = context.auth.uid
  let userDoc = db.collection('users').doc(uid)
  let userSnapshot = await userDoc.get()
  let user = await userSnapshot.data()
  let { stripeCustomerId, stripeSubscription } = user
  let plansPromise = _fetchPlans()

  if (!stripeCustomerId) {
    return {
      plans: await plansPromise,
    }
  }

  let customer = await stripe.customers.retrieve(stripeCustomerId, {
    expand: ['default_source'],
  })

  if (customer.deleted) {
    return {
      plans: await plansPromise,
    }
  }

  let card = customer.default_source
  let subscription =
    stripeSubscription &&
    (await stripe.subscriptions.retrieve(stripeSubscription.id, {
      expand: ['plan'],
    }))

  if (!subscription || subscription.status === 'canceled') {
    return {
      plans: await plansPromise,
    }
  }

  return {
    plans: await plansPromise,
    card: card && _pickPublicCardData(card),
    subscription: subscription && _pickPublicSubscriptionData(subscription),
  }
})

const createCustomerAndSubscription = functions.https.onCall(
  async (data, context) => {
    let plan = await stripe.plans.retrieve(data.planId)
    if (!plan.active) {
      return {
        status: 'error',
        error: {
          code: 'plan-inactive',
        },
      }
    }

    let email = context.auth.token.email
    let uid = context.auth.uid
    let userDoc = db.collection('users').doc(uid)
    let userSnapshot = await userDoc.get()
    let user = await userSnapshot.data()
    let stripeCustomerId = user.stripeCustomerId

    // Override any old/broken customer ids
    if (stripeCustomerId) {
      try {
        let { deleted } = await stripe.customers.retrieve(stripeCustomerId)
        if (deleted) {
          stripeCustomerId = null
        }
      } catch (e) {
        stripeCustomerId = null
      }
    }

    // Try setting up payment source for customer
    try {
      if (!stripeCustomerId) {
        let customer = await stripe.customers.create({
          preferred_locales: [data.language],
          source: data.token,
          email: email,
          name: data.name,
          tax_exempt: data.country !== 'JP' ? 'exempt' : 'none',
          metadata: {
            country: data.country,
          },
        })

        stripeCustomerId = customer.id

        await userDoc.set(
          {
            stripeCustomerId,
            country: data.country,
          },
          { merge: true },
        )
      } else {
        await stripe.customers.update(stripeCustomerId, {
          preferred_locales: [data.language],
          source: data.token,
          tax_exempt: data.country !== 'JP' ? 'exempt' : 'none',
          metadata: {
            country: data.country,
          },
        })
        await userDoc.update({
          country: data.country,
        })
      }
    } catch (error) {
      console.error(error)
      return { status: 'error', error }
    }

    let stripeSubscriptionId =
      user.stripeSubscription && user.stripeSubscription.id

    // If there's an existing subscription id, the upgrade/downgrade
    // functions should be used instead.
    if (stripeSubscriptionId) {
      let subscription
      try {
        subscription = await stripe.subscriptions.retrieve(
          stripeSubscriptionId,
          {
            expand: ['latest_invoice'],
          },
        )
      } catch (error) {}

      if (subscription) {
        // Let's not create a new subscription if one already exists.
        if (subscription.status === 'active') {
          return {
            status: 'error',
            error: {
              code: 'already-subscribed',
            },
          }
        }
      }

      // TODO:
      // - check if coupon matches too
      if (subscription.plan.id !== plan.id) {
        // The existing incomplete subscription has the wrong plan, so nuke it
        // and continue to create a new one.
        await stripe.subscriptions.del(stripeSubscriptionId)
        stripeSubscriptionId = undefined
      } else {
        // We have matching plans, so let's attempt a payment with the new
        // source.
        try {
          let invoice = await stripe.invoices.pay(
            subscription.latest_invoice.id,
            {
              expand: ['payment_intent'],
            },
          )

          return await renderSubscriptionPaymentAttempt(
            await stripe.subscriptions.retrieve(stripeSubscriptionId),
            invoice,
            userDoc,
            plan,
          )
        } catch (error) {
          console.error(error)
          return { status: 'error', error }
        }
      }
    }

    // Create a new subscription, and return the payment status.
    try {
      let subscription = await stripe.subscriptions.create({
        expand: ['latest_invoice.payment_intent'],
        customer: stripeCustomerId,
        items: [
          {
            plan: plan.id,
          },
        ],
      })

      return await renderSubscriptionPaymentAttempt(
        subscription,
        subscription.latest_invoice,
        userDoc,
        plan,
      )
    } catch (error) {
      console.error(error)
      return { status: 'error', error }
    }
  },
)

async function renderSubscriptionPaymentAttempt(
  subscription,
  invoice,
  userDoc,
  plan,
) {
  let stripeSubscription = {
    id: subscription.id,
    planId: subscription.plan.id,
    status: subscription.status,
  }

  let paymentIntentStatus = invoice.payment_intent.status
  if (paymentIntentStatus === 'requires_payment_method') {
    await userDoc.set(
      {
        stripeSubscription,
        hasChosenPlan: true,
      },
      { merge: true },
    )

    return {
      status: 'error',
      error: {
        code: 'card-declined',
      },
    }
  }

  await userDoc.set(
    {
      stripeSubscription,
      availableCasts: parseInt(plan.metadata.dailyCasts),
      availableVouches: parseInt(plan.metadata.dailyVouches),
      premiumUsername: !!plan.metadata.premiumUsername,
      lastTopUpAt: Date.now(),
      hasChosenPlan: true,
    },
    { merge: true },
  )

  return {
    status: 'success',
    subscriptionStatus: subscription.status,
    paymentIntentStatus,
  }
}

//
// Plans
//

const getPlan = functions.https.onCall(async (id, context) => {
  let plan = await stripe.plans.retrieve(id)
  return _pickPublicPlanData(plan)
})

const getPlans = functions.https.onCall(async (data, context) => {
  return _fetchPlans()
})

async function _fetchPlans() {
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
      results[entry[0]] = _pickPublicPlanData(plan)
    }
  }
  return results
}

function _pickPublicPlanData(plan) {
  return {
    id: plan.id,
    active: plan.active,
    amount: plan.amount,
    currency: plan.currency,
    interval: plan.interval,
    interval_count: plan.interval_count,
    metadata: plan.metadata,
  }
}

function _pickPublicCardData(card) {
  return {
    brand: card.brand,
    last4: card.last4,
    exp_month: card.exp_month,
    exp_year: card.exp_year,
  }
}

function _pickPublicSubscriptionData(subscription) {
  return {
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: subscription.current_period_end,
    plan: _pickPublicPlanData(subscription.plan),
  }
}

module.exports = {
  cancelSubscription,
  changePlan,
  createCustomerAndSubscription,
  getBillingDetails,
  getPlan,
  getPlans,
  updateCard,
}
