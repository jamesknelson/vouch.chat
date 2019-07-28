import React, { useEffect, useState } from 'react'
import { css } from 'styled-components/macro'

import Button, { FormSubmitButton } from 'components/button'
import CardForm from 'components/cardForm'
import { FirstIssueMessage } from 'components/message'
import Modal, { ModalGutter } from 'components/modal'
import { Gap, P } from 'components/responsive'
import useOperation from 'hooks/useOperation'
import subscribeToPlan from 'operations/subscribeToPlan'
import updateBillingDetails from 'operations/updateBillingDetails'

export default function BillingRestartSubscriptionModal({
  hasCard,
  subscription,
  open,
  onClose,
}) {
  let [hasCardAtOpen, setHasCardAtOpen] = useState(hasCard)

  useEffect(() => {
    setHasCardAtOpen(hasCard)
    subscribeToPlanOperation.clearSettled()
    // Only want to clear settled when the modal opens/closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  let subscribeToPlanOperation = useOperation(subscribeToPlan, {
    onSuccess: onClose,
    defaultProps: {
      planId: subscription.plan.id,
    },
  })
  let updateCardOperation = useOperation(updateBillingDetails, {
    onSuccess: subscribeToPlanOperation.invoke,
  })

  let content = hasCardAtOpen ? (
    <>
      <P>Let's get your wig back.</P>
      <FirstIssueMessage issues={subscribeToPlanOperation.error} />
      <Button
        busy={subscribeToPlanOperation.busy}
        disabled={subscribeToPlanOperation.busy}
        onClick={subscribeToPlanOperation.invoke}
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
      onClose={subscribeToPlanOperation.busy ? undefined : onClose}>
      <ModalGutter>{content}</ModalGutter>
    </Modal>
  )
}
