import React from 'react'
import styled, { css } from 'styled-components/macro'

import Button from 'components/button'
import Modal, { ModalGutter } from 'components/modal'
import useOperation from 'hooks/useOperation'
import cancelSubscription from 'operations/cancelSubscription'
import { colors } from 'theme'
import formatDate from 'utils/formatDate'

const P = styled.p`
  color: ${props => props.color || colors.text.default};
  font-size: 0.9rem;
  margin: 1rem 0;
`

export default function BillingCancelSubscriptionModal({
  currentPeriodEnd,
  open,
  onClose,
}) {
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
          <strong>{formatDate(currentPeriodEnd, 'en')}</strong>.
        </P>
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
          Okay, please cancel.
        </Button>
      </ModalGutter>
    </Modal>
  )
}
