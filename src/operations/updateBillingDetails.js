import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'
import validateBillingAddress from 'utils/validateBillingAddress'

updateBillingDetails.useDependencies = function useDependencies() {
  return useBackend()
}

updateBillingDetails.validate = function validate(params) {
  return validateBillingAddress(params)
}

export default async function updateBillingDetails(
  { stripe, ...billing },
  backend,
) {
  try {
    const { token, error } = await stripe.createToken({
      type: 'card',
      ...billing,
    })

    if (error) {
      return normalizeIssues((error && error.message) || 'error')
    }

    let updateBillingDetails = backend.functions.httpsCallable(
      'api-updateBillingDetails',
    )
    let { data } = await updateBillingDetails({
      country: billing.address_country,
      language: 'en',
      name: billing.name,
      token: token.id,
    })

    if (data.status === 'error') {
      return normalizeIssues((data.error && data.error.code) || 'error')
    }
  } catch (error) {
    return normalizeIssues('error')
  }
}
