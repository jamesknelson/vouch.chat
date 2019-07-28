import React, { useEffect } from 'react'
import { css } from 'styled-components/macro'

import Button from 'components/button'
import { FirstIssueMessage } from 'components/message'
import Modal, { ModalGutter } from 'components/modal'
import { P } from 'components/responsive'
import useOperation from 'hooks/useOperation'
import removeBillingCard from 'operations/removeBillingCard'

export default function BillingRemoveCardModal({ canRemove, open, onClose }) {
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
      <FirstIssueMessage issues={operation.error} />
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
