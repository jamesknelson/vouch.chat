const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')
const topUp = require('../util/topUp')

const db = admin.firestore()
const members = db.collection('members')

exports.subscribeToPlan = functions.https.onCall(
  async ({ planId }, context) => {
    let uid = context.auth.uid
    let accountRef = await members
      .doc(uid)
      .collection('private')
      .doc('account')
    let accountSnapshot = await accountRef.get()
    let account = accountSnapshot.exists ? accountSnapshot.data() : {}
    let stripeCustomerId = account.stripeCustomerId
    let stripeSubscriptionId =
      account.subscription && account.subscription.stripeId

    let stripePlan = await stripe.plans.retrieve(planId)
    if (!stripePlan.active) {
      return {
        status: 'error',
        error: {
          code: 'plan-inactive',
        },
      }
    }

    if (stripeSubscriptionId) {
      let stripeSubscription
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          stripeSubscriptionId,
          {
            expand: ['latest_invoice'],
          },
        )
      } catch (error) {}

      // If an active subscription already exists, let's make sure it's set to
      // continue into the next period, and change the plan to the requested
      // plan if required. No immediate payment is required.
      if (stripeSubscription && stripeSubscription.status === 'active') {
        stripeSubscription = await stripe.subscriptions.update(
          stripeSubscription.id,
          {
            expand: ['plan'],
            cancel_at_period_end: false,
            plan: planId,
          },
        )
        await accountRef.update({
          subscription: pickers.subscription(stripeSubscription),
        })
        await topUp(accountRef, {
          forPlanChange: true,
        })
        return {
          status: 'success',
          subscriptionStatus: 'active',
        }
      }

      if (
        stripeSubscription &&
        (stripeSubscription.plan.id !== stripePlan.id ||
          (stripeSubscription.status !== 'incomplete' &&
            stripeSubscription.status !== 'past_due'))
      ) {
        // The existing subscription can't be reused, so nuke it and start
        // from scratch.
        await stripe.subscriptions.del(stripeSubscriptionId)
        stripeSubscriptionId = undefined
      } else {
        // We have matching plans and a subscription that can be reused with
        // payment, so attempt a payment.
        try {
          let invoice = await stripe.invoices.pay(
            stripeSubscription.latest_invoice.id,
            {
              expand: ['payment_intent'],
            },
          )

          return await renderSubscriptionPaymentAttempt(
            await stripe.subscriptions.retrieve(stripeSubscriptionId, {
              expand: ['latest_invoice.payment_intent', 'plan'],
            }),
            invoice,
            accountRef,
          )
        } catch (error) {
          console.error(error)
          return { status: 'error', error }
        }
      }
    }

    // Create a new subscription, and return the payment status.
    try {
      let stripeSubscription = await stripe.subscriptions.create({
        expand: ['latest_invoice.payment_intent', 'plan'],
        customer: stripeCustomerId,
        items: [
          {
            plan: stripePlan.id,
          },
        ],
      })

      return await renderSubscriptionPaymentAttempt(
        stripeSubscription,
        stripeSubscription.latest_invoice,
        accountRef,
      )
    } catch (error) {
      console.error(error)
      return { status: 'error', error }
    }
  },
)

async function renderSubscriptionPaymentAttempt(
  stripeSubscription,
  stripeInvoice,
  accountRef,
) {
  let subscription = pickers.subscription(stripeSubscription)
  let paymentIntentStatus = stripeInvoice.payment_intent.status

  if (paymentIntentStatus === 'requires_payment_method') {
    await accountRef.set(
      {
        subscription,
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

  await accountRef.set(
    {
      // This exists separately from stripeSubscription so that it is possible
      // to indicate that the user wants to use the free plan.
      hasChosenPlan: true,

      // Schedule a top up 23 hours from now
      nextScheduledTopUpAt: Date.now() + 23 * 60 * 60 * 1000,

      subscription,
    },
    { merge: true },
  )

  await topUp(accountRef)

  return {
    status: 'success',
    subscriptionStatus: stripeSubscription.status,
    paymentIntentStatus,
    paymentIntentSecret: stripeInvoice.payment_intent.client_secret,
  }
}
