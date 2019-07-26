import { route } from 'navi'
import React, { useEffect } from 'react'
import { useNavigation } from 'react-navi'
import { css } from 'styled-components/macro'

import Button from 'components/button'
import Currency from 'components/currency'
import { LayoutHeaderSection } from 'components/layout'
import { Box, Gap, P } from 'components/responsive'
import { Section } from 'components/sections'
import useLatestSnapshot from 'hooks/useLatestSnapshot'
import useToggle from 'hooks/useToggle'
import formatDate from 'utils/formatDate'
import BillingCancelSubscriptionModal from './billingCancelSubscriptionModal'
import BillingPlansModal from './billingPlansModal'
import BillingRemoveCardModal from './billingRemoveCardModal'
import BillingRestartSubscriptionModal from './billingRestartSubscriptionModal'
import BillingUpdateCardModal from './billingUpdateCardModal'

function Billing(props) {
  let planId = props.planId
  let accountSnapshot = useLatestSnapshot(
    props.accountRef,
    props.accountSnapshot,
  )
  let navigation = useNavigation()
  let account = accountSnapshot.exists && accountSnapshot.data()
  let { card, subscription } = account || { card: null, subscription: null }
  let [isPlansModalOpen, showPlansModal, hidePlansModal] = useToggle()
  let [
    isRestartSubscriptionModalOpen,
    showRestartSubscriptionModal,
    hideRestartSubscriptionModal,
  ] = useToggle()
  let [isCancelModalOpen, showCancelModal, hideCancelModal] = useToggle()
  let [
    isUpdateCardModalOpen,
    showUpdateCardModal,
    hideUpdateCardModal,
  ] = useToggle()
  let [
    isRemoveCardModalOpen,
    showRemoveCardModal,
    hideRemoveCardModal,
  ] = useToggle()

  let hasSelectedPlan = !!planId
  useEffect(() => {
    if (hasSelectedPlan) {
      showPlansModal()
    }
  }, [hasSelectedPlan, showPlansModal])

  let hidePlansModalAndNavigate = () => {
    hidePlansModal()
    if (planId) {
      // Remove planId from the URL query
      navigation.navigate({ query: {} })
    }
  }

  let plan = subscription && subscription.plan
  let formattedDate =
    subscription && formatDate(subscription.currentPeriodEnd, 'en')

  return (
    <>
      <LayoutHeaderSection />
      <Gap size={{ default: 1, tabletPlus: 0 }} />
      <Section title="Your Wig">
        <Box padding="0 1rem 1rem">
          {subscription && subscription.status === 'active' ? (
            <>
              <P>
                You're currently subscribed to the <strong>{plan.name}</strong>,
                for <Currency amount={plan.amount} currency={plan.currency} /> /
                month.
              </P>
              <P>
                {subscription.cancelAtPeriodEnd
                  ? `Your subscription will expire on ${formattedDate}.`
                  : `Your next invoice will be sent on ${formattedDate}`}
              </P>
            </>
          ) : (
            <>
              <P>You're currently wigless.</P>
            </>
          )}
          <Button
            inline
            size="small"
            onClick={showPlansModal}
            css={css`
              margin: 0.2rem;
            `}>
            {subscription &&
            subscription.status === 'active' &&
            !subscription.cancelAtPeriodEnd
              ? 'Change Wig'
              : 'See Wigs'}
          </Button>
          <BillingPlansModal
            subscriptionWillBeInactive={
              subscription &&
              (subscription.cancelAtPeriodEnd ||
                subscription.status !== 'active')
            }
            card={card}
            currentPlan={
              subscription && subscription.status === 'active' && plan
            }
            selectedPlanId={planId}
            onClose={hidePlansModalAndNavigate}
            open={isPlansModalOpen}
          />
          {subscription &&
            (subscription.status !== 'active' ||
            subscription.cancelAtPeriodEnd ? (
              <>
                <Button
                  inline
                  size="small"
                  onClick={showRestartSubscriptionModal}
                  css={css`
                    margin: 0.2rem;
                  `}>
                  Restart my subscription
                </Button>
                <BillingRestartSubscriptionModal
                  hasCard={!!card}
                  subscription={subscription}
                  open={isRestartSubscriptionModalOpen}
                  onClose={hideRestartSubscriptionModal}
                />
              </>
            ) : (
              <>
                <Button
                  inline
                  outline
                  size="small"
                  onClick={showCancelModal}
                  css={css`
                    margin: 0.2rem;
                  `}>
                  Cancel my subscription
                </Button>
                <BillingCancelSubscriptionModal
                  currentPeriodEnd={
                    subscription && subscription.currentPeriodEnd
                  }
                  open={isCancelModalOpen}
                  onClose={hideCancelModal}
                />
              </>
            ))}
        </Box>
      </Section>
      <Gap size={{ default: 1, tabletPlus: 0 }} />
      {account.stripeCustomerId && (
        <Section title="Your Card">
          <Box padding="0 1rem 1rem">
            {card ? (
              <ul
                css={css`
                  padding-left: 1.5rem;
                  margin: 1rem 0;
                `}>
                <li>{card.brand}</li>
                <li>
                  &middot;&middot;&middot;&middot;
                  &middot;&middot;&middot;&middot;
                  &middot;&middot;&middot;&middot; {card.last4}
                </li>
                <li>
                  <span>Expiration:</span> {card.expMonth}/{card.expYear}
                </li>
              </ul>
            ) : (
              <P>You don't have any credit card details saved.</P>
            )}
            <Button
              inline
              size="small"
              onClick={showUpdateCardModal}
              css={css`
                margin: 0.2rem;
              `}>
              {card ? 'Change' : 'Add'} Card
            </Button>
            <BillingUpdateCardModal
              open={isUpdateCardModalOpen}
              onClose={hideUpdateCardModal}
            />
            {card && (
              <>
                <Button
                  inline
                  outline
                  size="small"
                  onClick={showRemoveCardModal}
                  css={css`
                    margin: 0.2rem;
                  `}>
                  Remove Card
                </Button>
                <BillingRemoveCardModal
                  canRemove={
                    !subscription ||
                    subscription.cancelAtPeriodEnd ||
                    subscription.status !== 'active'
                  }
                  open={isRemoveCardModalOpen}
                  onClose={hideRemoveCardModal}
                />
              </>
            )}
          </Box>
        </Section>
      )}
    </>
  )
}

export default route({
  title: 'Billing',
  getView: async ({ context, params }) => {
    let { backend, currentUser } = context
    let accountRef = backend.db
      .collection('members')
      .doc(currentUser.uid)
      .collection('private')
      .doc('account')
    let accountSnapshot = await accountRef.get()

    return (
      <Billing
        accountRef={accountRef}
        accountSnapshot={accountSnapshot}
        planId={params.planId}
      />
    )
  },
})
