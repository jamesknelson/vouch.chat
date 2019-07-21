import React, { useEffect } from 'react'
import styled, { css } from 'styled-components/macro'

import Button from 'components/button'
import Modal, { ModalGutter } from 'components/modal'
import useOperation from 'hooks/useOperation'
import removeBillingCard from 'operations/removeBillingCard'
import { colors } from 'theme'

const P = styled.p`
  color: ${props => props.color || colors.text.default};
  font-size: 0.9rem;
  margin: 1rem 0;
`

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
