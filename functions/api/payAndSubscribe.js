const admin = require('firebase-admin')
const functions = require('firebase-functions')
const pickers = require('../util/pickers')
const { stripe } = require('../util/stripe')
const topUp = require('../util/topUp')

const db = admin.firestore()
const members = db.collection('members')

exports.createCustomerAndSubscription = functions.https.onCall(
  async (data, context) => {
    let stripePlan = await stripe.plans.retrieve(data.planId)
    if (!stripePlan.active) {
      return {
        status: 'error',
        error: {
          code: 'plan-inactive',
        },
      }
    }

    let email = context.auth.token.email
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
        let stripeCustomer = await stripe.customers.create({
          preferred_locales: [data.language],
          source: data.token,
          email: email,
          name: data.name,
          tax_exempt: data.country !== 'JP' ? 'exempt' : 'none',
          metadata: {
            country: data.country,
          },
        })

        stripeCustomerId = stripeCustomer.id

        await accountRef.set(
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
        await accountRef.update({
          country: data.country,
        })
      }
    } catch (error) {
      console.error(error)
      return { status: 'error', error }
    }

    // If there's an existing subscription id, the upgrade/downgrade
    // functions should be used instead.
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

      if (stripeSubscription) {
        // Let's not create a new subscription if one already exists.
        if (stripeSubscription.status === 'active') {
          return {
            status: 'error',
            error: {
              code: 'already-subscribed',
            },
          }
        }
      }

      if (stripeSubscription.plan.id !== stripePlan.id) {
        // The existing incomplete subscription has the wrong plan, so nuke it
        // and continue to create a new one.
        await stripe.subscriptions.del(stripeSubscriptionId)
        stripeSubscriptionId = undefined
      } else {
        // We have matching plans, so let's attempt a payment with the new
        // source.
        try {
          let invoice = await stripe.invoices.pay(
            stripeSubscription.latest_invoice.id,
            {
              expand: ['payment_intent'],
            },
          )

          return await renderSubscriptionPaymentAttempt(
            await stripe.subscriptions.retrieve(stripeSubscriptionId),
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
        expand: ['latest_invoice.payment_intent'],
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
      subscription,
    },
    { merge: true },
  )

  await topUp(accountRef)

  return {
    status: 'success',
    subscriptionStatus: stripeSubscription.status,
    paymentIntentStatus,
  }
}
