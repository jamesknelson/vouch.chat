import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { FormSubmitButton } from 'components/button'
import CardForm from 'components/cardForm'
import Modal, { ModalGutter } from 'components/modal'
import { Gap } from 'components/sections'
import useOperation from 'hooks/useOperation'
import payAndSubscribe from 'operations/payAndSubscribe'
import restartSubscription from 'operations/restartSubscription'
import updateBillingCard from 'operations/updateBillingCard'
import { colors } from 'theme'

const P = styled.p`
  color: ${props => props.color || colors.text.default};
  font-size: 0.9rem;
  margin: 1rem 0;
`

export default function BillingRestartSubscriptionModal({
  hasCard,
  subscription,
  open,
  onClose,
}) {
  let [hasCardAtOpen, setHasCardAtOpen] = useState(hasCard)

  useEffect(() => {
    setHasCardAtOpen(hasCard)
    restartSubscriptionOperation.clearSettled()
    // Only want to clear settled when the modal opens/closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  let restartSubscriptionOperation = useOperation(
    subscription.cancelAtPeriodEnd ? restartSubscription : payAndSubscribe,
    {
      onSuccess: onClose,
      defaultProps: {
        planId: subscription.plan.id,
        language: 'en',
      },
    },
  )
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
      closeOnBackdropClick={false}
      closeOnEscape={false}
      title="Restart Your Subscription"
      onClose={restartSubscriptionOperation.busy ? undefined : onClose}>
      <ModalGutter>{content}</ModalGutter>
    </Modal>
  )
}
