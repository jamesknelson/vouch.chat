const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')
const topUp = require('../util/topUp')

const db = admin.firestore()

exports.createCustomerAndSubscription = functions.https.onCall(
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
) {
  let stripeSubscription = pickers.subscription(subscription)
  let paymentIntentStatus = invoice.payment_intent.status
  if (paymentIntentStatus === 'requires_payment_method') {
    await userDoc.set(
      {
        stripeSubscription,
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
      // This exists separately from stripeSubscription so that it is possible
      // to indicate that the user wants to use the free plan.
      hasChosenPlan: true,
      stripeSubscription,
    },
    { merge: true },
  )

  await topUp(userDoc.id)

  return {
    status: 'success',
    subscriptionStatus: subscription.status,
    paymentIntentStatus,
  }
}
