import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateBillingAddress from 'utils/validateBillingAddress'

updateBillingCard.useDependencies = function useDependencies() {
  return useBackend()
}

updateBillingCard.validate = function validate(params) {
  return validateBillingAddress(params)
}

export default async function updateBillingCard(
  { stripe, ...billing },
  backend,
) {
  try {
    const { token, error } = await stripe.createToken({
      type: 'card',
      ...billing,
    })

    if (error) {
      return normalizeIssues(
        (error && error.message) || 'Something went wrong.',
      )
    }

    let updateBillingCard = backend.functions.httpsCallable(
      'api-updateBillingCard',
    )
    let { data } = await updateBillingCard({
      country: billing.address_country,
      token: token.id,
    })

    if (data.status === 'error') {
      return normalizeIssues(
        (data.error && data.error.code) || 'Something went wrong.',
      )
    }
  } catch (error) {
    return normalizeIssues('Something went wrong.')
  }
}
