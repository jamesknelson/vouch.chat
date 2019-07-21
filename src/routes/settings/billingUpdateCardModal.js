import React from 'react'
import { css } from 'styled-components/macro'

import { FormSubmitButton } from 'components/button'
import CardForm from 'components/cardForm'
import Modal, { ModalGutter } from 'components/modal'
import useOperation from 'hooks/useOperation'
import updateBillingCard from 'operations/updateBillingCard'

export default function BillingUpdateCardModal({ open, onClose }) {
  let operation = useOperation(updateBillingCard, {
    onSuccess: onClose,
  })

  return (
    <Modal
      open={open}
      closeOnBackdropClick={false}
      closeOnEscape={false}
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
