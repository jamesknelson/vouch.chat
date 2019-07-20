import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

removeBillingCard.useDependencies = function useDependencies() {
  return useBackend()
}

export default async function removeBillingCard(params, backend) {
  let removeBillingCard = backend.functions.httpsCallable(
    'api-removeBillingCard',
  )

  return await new Promise(async (resolve, reject) => {
    let { data } = await removeBillingCard()

    if (data.status !== 'success') {
      return resolve(normalizeIssues('Something went wrong'))
    }

    // Wait for the card to actually be removed
    backend.db
      .collection('members')
      .doc(backend.auth.currentUser.uid)
      .collection('private')
      .doc('account')
      .onSnapshot(snapshot => {
        if (!snapshot.data().card) {
          resolve()
        }
      })
  })
}
