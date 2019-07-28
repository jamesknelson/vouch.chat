import { useBackend, useStripe } from 'context'
import { normalizeIssues } from 'utils/Issues'

subscribeToPlan.useDependencies = function useDependencies() {
  return [useBackend(), useStripe()]
}

export default async function subscribeToPlan({ planId }, [backend, stripe]) {
  try {
    let subscribeToPlan = backend.functions.httpsCallable('api-subscribeToPlan')
    let { data: subscribeToPlanData } = await subscribeToPlan({
      planId,
    })

    if (subscribeToPlanData.status === 'success') {
      if (subscribeToPlanData.subscriptionStatus === 'active') {
        // Hooray!
        return
      } else if (
        subscribeToPlanData.paymentIntentStatus === 'requires_action'
      ) {
        // Opens a modal to complete the payment
        let result = await stripe.handleCardPayment(
          subscribeToPlanData.paymentIntentSecret,
        )
        if (result.error) {
          return normalizeIssues(result.error && result.error.message)
        } else {
          // Hooray!
          return
        }
      }
    }

    let error = subscribeToPlanData.error
    if (error) {
      if (error.code === 'card-declined') {
        return normalizeIssues({
          stripe: 'card-declined',
        })
      } else if (error.code === 'plan-inactive') {
        return normalizeIssues(error.code)
      }
    }

    return normalizeIssues('error')
  } catch (error) {
    return normalizeIssues(error.message || 'error')
  }
}
