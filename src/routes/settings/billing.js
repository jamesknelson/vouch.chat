import { route } from 'navi'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { FormSubmitButton } from 'components/button'
import CardForm from 'components/cardForm'
import Currency from 'components/currency'
import { LayoutHeaderSection } from 'components/layout'
import Modal, { ModalGutter } from 'components/modal'
import PlansGrid from 'components/plansGrid'
import { Gutter, Section, SectionSubHeading, Gap } from 'components/sections'
import { useBackend } from 'context'
import useLatestSnapshot from 'hooks/useLatestSnapshot'
import useOperation from 'hooks/useOperation'
import useToggle from 'hooks/useToggle'
import cancelSubscription from 'operations/cancelSubscription'
import changeSubscriptionPlan from 'operations/changeSubscriptionPlan'
import payAndSubscribe from 'operations/payAndSubscribe'
import updateBillingCard from 'operations/updateBillingCard'
import removeBillingCard from 'operations/removeBillingCard'
import restartSubscription from 'operations/restartSubscription'
import { colors, dimensions } from 'theme'
import { Spinner } from 'components/loading'

const P = styled.p`
  color: ${props => props.color || colors.text};
  font-size: 0.9rem;
  margin: 1rem 0;
`

function formatDate(date) {
  return new Date(date * 1000).toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Billing({ accountRef, accountSnapshot }) {
  accountSnapshot = useLatestSnapshot(accountRef, accountSnapshot)

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

  let plan = subscription && subscription.plan
  let formattedDate =
    subscription &&
    new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <>
      <LayoutHeaderSection />
      <SectionSubHeading>Your Wig</SectionSubHeading>
      <Section
        css={css`
          color: ${colors.lightBlack};
        `}>
        <Gutter>
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
          <PlansModal
            card={card}
            currentPlan={
              subscription && subscription.status === 'active' && plan
            }
            onClose={hidePlansModal}
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
                <RestartSubscriptionModal
                  hasCard={!!card}
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
                <CancelModal
                  currentPeriodEnd={
                    subscription && subscription.currentPeriodEnd
                  }
                  open={isCancelModalOpen}
                  onClose={hideCancelModal}
                />
              </>
            ))}
        </Gutter>
        {/* <Modal
          open={showSwitchModal}
          title="Change Wig"
          onClose={() => {
            setShowSwitchModal(false)
          }}>
          <p>
            Are you sure you want to change your wig? Your new wig will cost{' '}
            <Currency amount={plan.amount} currency={plan.currency} /> / month.
          </p>
          <Button
            onClick={switchPlan}
            css={css`
              width: 100%;
            `}>
            Change Wig
          </Button>
        </Modal> */}
      </Section>
      <SectionSubHeading>Your Card</SectionSubHeading>
      <Section>
        <Gutter>
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
          <UpdateBillingCardModal
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
              <RemoveBillingCardModal
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
        </Gutter>
      </Section>
    </>
  )
}

function PlansModal({ card, currentPlan, open, onClose }) {
  let backend = useBackend()

  // Fetch the plans
  let [{ plans, plansStatus }, setPlansState] = useState({
    plans: undefined,
    plansStatus: 'loading',
  })
  useEffect(() => {
    let unmounted = false
    let getPlans = backend.functions.httpsCallable('api-getPlans')
    getPlans()
      .then(({ data: plans }) => {
        if (!unmounted) {
          setPlansState({ plans, plansStatus: 'ready' })
        }
      })
      .catch(error => {
        console.error(error)
        if (!unmounted) {
          setPlansState({ plans: undefined, plansStatus: 'error' })
        }
      })
    return () => {
      unmounted = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let operation = useOperation(
    card ? changeSubscriptionPlan : payAndSubscribe,
    {
      onSuccess: onClose,
    },
  )

  useEffect(() => {
    operation.clearSettled()
    // Only want to clear settled when the modal opens/closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  let content
  if (plansStatus === 'loading') {
    content = (
      <div
        css={css`
          margin: 4rem auto;
          height: 4rem;
          width: 4rem;
        `}>
        <Spinner
          backgroundColor={colors.structure.bg}
          color={colors.ink.light}
        />
      </div>
    )
  } else if (plansStatus === 'ready') {
    content = (
      <>
        <Gap size={4} />
        <PlansGrid plans={plans} />
      </>
    )
  } else {
    content = (
      <div
        css={css`
          margin: 4rem auto;
          height: 4rem;
          width: 4rem;
        `}>
        Something went wrong.
      </div>
    )
  }

  return (
    <Modal
      align="top"
      open={open}
      title={currentPlan ? 'Change Your Wig' : 'Get A Wig'}
      width={dimensions.largeCardWidth}
      onClose={operation.busy ? undefined : onClose}>
      <ModalGutter>{content}</ModalGutter>
    </Modal>
  )
}

function RestartSubscriptionModal({ hasCard, open, onClose }) {
  let [hasCardAtOpen, setHasCardAtOpen] = useState(hasCard)

  useEffect(() => {
    setHasCardAtOpen(hasCard)
    restartSubscriptionOperation.clearSettled()
    // Only want to clear settled when the modal opens/closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  let restartSubscriptionOperation = useOperation(restartSubscription, {
    onSuccess: onClose,
  })
  let updateCardOperation = useOperation(updateBillingCard, {
    onSuccess: restartSubscriptionOperation.invoke,
  })

  let content = hasCardAtOpen ? (
    <>
      <P>Let's get your wig back.</P>
      {restartSubscriptionOperation.error && (
        <P color={colors.text.warning}>
          {Object.values(restartSubscriptionOperation.error)[0][0]}
        </P>
      )}
      <Button
        busy={restartSubscriptionOperation.busy}
        disabled={restartSubscriptionOperation.busy}
        onClick={restartSubscriptionOperation.invoke}
        css={css`
          width: 100%;
        `}>
        Restart my subscription
      </Button>
    </>
  ) : (
    <>
      <Gap />
      <CardForm
        validate={updateCardOperation.validate}
        onSubmit={updateCardOperation.invoke}>
        <FormSubmitButton
          css={css`
            margin-top: 1.5rem;
            width: 100%;
          `}>
          Restart my subscription
        </FormSubmitButton>
      </CardForm>
    </>
  )

  return (
    <Modal
      open={open}
      title="Restart Your Subscription"
      onClose={restartSubscriptionOperation.busy ? undefined : onClose}>
      <ModalGutter>{content}</ModalGutter>
    </Modal>
  )
}

function RemoveBillingCardModal({ canRemove, open, onClose }) {
  let operation = useOperation(removeBillingCard, {
    onSuccess: onClose,
  })

  useEffect(() => {
    operation.clearSettled()
    // Only want to clear settled when the modal opens/closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  let content = canRemove ? (
    <>
      <P>So you want to remove your card details?</P>
      {operation.error && (
        <P color={colors.text.warning}>
          {Object.values(operation.error)[0][0]}
        </P>
      )}
      <Button
        busy={operation.busy}
        disabled={operation.busy}
        onClick={operation.invoke}
        css={css`
          width: 100%;
        `}>
        Remove my card details
      </Button>
    </>
  ) : (
    <>
      <P>
        You'll need to cancel your subscription before removing your card
        details.
      </P>
      <Button
        onClick={onClose}
        css={css`
          width: 100%;
        `}>
        Okay
      </Button>
    </>
  )

  return (
    <Modal
      open={open}
      title="Remove Card Details"
      onClose={operation.busy ? undefined : onClose}>
      <ModalGutter>{content}</ModalGutter>
    </Modal>
  )
}

function UpdateBillingCardModal({ open, onClose }) {
  let operation = useOperation(updateBillingCard, {
    onSuccess: onClose,
  })

  return (
    <Modal
      open={open}
      title="Update Billing Card"
      onClose={operation.busy ? undefined : onClose}>
      <ModalGutter
        css={css`
          padding-top: 1rem;
        `}>
        <CardForm validate={operation.validate} onSubmit={operation.invoke}>
          <FormSubmitButton
            css={css`
              margin-top: 1.5rem;
              width: 100%;
            `}>
            Save
          </FormSubmitButton>
        </CardForm>
      </ModalGutter>
    </Modal>
  )
}

function CancelModal({ currentPeriodEnd, open, onClose }) {
  let operation = useOperation(cancelSubscription, {
    onSuccess: onClose,
  })

  return (
    <Modal
      open={open}
      title="Cancel My Subscription"
      onClose={operation.busy ? undefined : onClose}>
      <ModalGutter>
        <P>
          If you cancel now, you'll no longer have access from{' '}
          <strong>{formatDate(currentPeriodEnd)}</strong>.
        </P>
        <Button
          busy={operation.busy}
          disabled={operation.busy}
          onClick={operation.invoke}
          css={css`
            width: 100%;
          `}>
          Okay, please cancel.
        </Button>
      </ModalGutter>
    </Modal>
  )
}

export default route({
  title: 'Billing',
  getView: async ({ context }) => {
    let { backend, currentUser } = context
    let accountRef = backend.db
      .collection('members')
      .doc(currentUser.uid)
      .collection('private')
      .doc('account')
    let accountSnapshot = await accountRef.get()

    return <Billing accountRef={accountRef} accountSnapshot={accountSnapshot} />
  },
})
