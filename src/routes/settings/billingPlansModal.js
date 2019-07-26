import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { FormSubmitButton } from 'components/button'
import CardForm from 'components/cardForm'
import Currency from 'components/currency'
import { Spinner } from 'components/loading'
import Modal, { ModalGutter } from 'components/modal'
import PlansGrid from 'components/plansGrid'
import { Clamp, Gap, P } from 'components/responsive'
import useOperation from 'hooks/useOperation'
import subscribeToPlan from 'operations/subscribeToPlan'
import updateBillingDetails from 'operations/updateBillingDetails'
import { useBackend } from 'context'
import { colors, dimensions } from 'theme'

const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 3rem;
  margin-bottom: 2.5rem;
  text-align: center;
`

export default function BillingPlansModal({
  card,
  currentPlan,
  open,
  onClose,
  selectedPlanId,
  subscriptionWillBeInactive,
}) {
  let backend = useBackend()
  let [
    {
      card: cardAtOpen,
      subscriptionWillBeInactive: subscriptionWillBeInactiveAtOpen,
    },
    setDataAtOpen,
  ] = useState({ card, subscriptionWillBeInactive })

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

  let subscribeToPlanOperation = useOperation(subscribeToPlan, {
    onSuccess: onClose,
    defaultProps: {
      planId: selectedPlanId,
    },
  })
  let updateCardOperation = useOperation(updateBillingDetails, {
    onSuccess: subscribeToPlanOperation.invoke,
  })

  useEffect(() => {
    subscribeToPlanOperation.clearSettled()
    updateCardOperation.clearSettled()
    if (open) {
      setDataAtOpen({ card, subscriptionWillBeInactive })
    }
    // Only want to change these values the modal opens/closes.
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
    if (selectedPlanId) {
      let plan = plans.find(plan => plan.id === selectedPlanId)

      if (cardAtOpen) {
        content = (
          <Clamp paddingBottom="3rem">
            <Title>Great Choice!</Title>
            <P>
              The {plan.name} goes for{' '}
              <Currency amount={plan.amount} currency={plan.currency} /> /
              month. You can{' '}
              {subscriptionWillBeInactiveAtOpen ? 'subscribe' : 'switch over'}{' '}
              to it immediately.
            </P>
            {subscribeToPlanOperation.error && (
              <P color={colors.text.warning}>
                {Object.values(subscribeToPlanOperation.error)[0][0]}
              </P>
            )}
            <Button
              busy={subscribeToPlanOperation.busy}
              disabled={subscribeToPlanOperation.busy}
              onClick={subscribeToPlanOperation.invoke}
              css={css`
                margin-top: 2.5rem;
                width: 100%;
              `}>
              {subscriptionWillBeInactiveAtOpen ? 'Subscribe' : 'Change to'} the{' '}
              {plan.name}
            </Button>
          </Clamp>
        )
      } else {
        content = (
          <Clamp paddingBottom="3rem">
            <Title>Great Choice!</Title>
            <P>
              To get the {plan.name} for{' '}
              <Currency amount={plan.amount} currency={plan.currency} /> /
              month, please enter your credit card details below.
            </P>
            <CardForm
              validate={updateCardOperation.validate}
              onSubmit={updateCardOperation.invoke}>
              <FormSubmitButton
                css={css`
                  margin-top: 2.5rem;
                  width: 100%;
                `}>
                Pay and Get My Wig
              </FormSubmitButton>
            </CardForm>
          </Clamp>
        )
      }
    } else {
      content = (
        <>
          <Gap size={4} />
          <PlansGrid currentPlan={currentPlan} plans={plans} />
        </>
      )
    }
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
      closeOnBackdropClick={false}
      closeOnEscape={false}
      open={open}
      title={currentPlan ? 'Change Your Wig' : 'Get A Wig'}
      width={dimensions.largeCardWidth}
      onClose={
        updateCardOperation.busy || subscribeToPlanOperation.busy
          ? undefined
          : onClose
      }>
      <ModalGutter>{content}</ModalGutter>
    </Modal>
  )
}
