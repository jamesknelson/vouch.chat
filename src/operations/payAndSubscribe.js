import { useBackend, useCurrentUser } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateBillingAddress from 'utils/validateBillingAddress'

payAndSubscribe.useDependencies = function useDependencies() {
  return [useCurrentUser(), useBackend()]
}

payAndSubscribe.validate = function validate(params, [currentUser]) {
  if (currentUser.hasActiveSubscription) {
    return normalizeIssues(
      "You've already signed up for a wig. You can change it from the settings page.",
    )
  }

  return validateBillingAddress(params)
}

export default async function payAndSubscribe(
  { language, planId, stripe, ...billing },
  [currentUser, backend],
) {
  try {
    const { token, error } = await stripe.createToken({
      type: 'card',
      ...billing,
    })

    if (error) {
      return normalizeIssues(error && error.message)
    }

    let createCustomerAndSubscription = backend.functions.httpsCallable(
      'api-createCustomerAndSubscription',
    )
    let { data } = await createCustomerAndSubscription({
      planId,
      country: billing.address_country,
      name: billing.name,
      language,
      token: token.id,
    })

    if (data.status === 'success') {
      if (data.subscriptionStatus === 'active') {
        // Hooray!
        return
      }

      // TODO:
      // - otherwise if payment intent status is "requires_action", use stripe API to continue
    } else {
      if (
        data.error.rawType === 'card_error' ||
        data.error.code === 'card-declined'
      ) {
        return {
          stripe: data.error.code.replace('_', '-'),
        }
      }
      if (
        data.error.code === 'plan-inactive' ||
        data.error.code === 'already-subscribed'
      ) {
        return normalizeIssues(data.error.code)
      }
    }

    return normalizeIssues('Something went wrong')
  } catch (error) {
    return normalizeIssues(error.message || 'Something went wrong')
  }
}
