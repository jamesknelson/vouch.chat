import { normalizeIssues } from './Issues'

function validateBillingAddress(params) {
  return normalizeIssues({
    name: params.name ? undefined : 'required',
    address_line1: params.address_line1 ? undefined : 'required',
    address_city: params.address_city ? undefined : 'required',
    address_zip: params.address_zip ? undefined : 'required',
    address_country: params.address_country ? undefined : 'required',
  })
}

export default validateBillingAddress
