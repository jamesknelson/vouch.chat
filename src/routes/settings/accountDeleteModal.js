import React from 'react'
import styled, { css } from 'styled-components/macro'

import { FormSubmitButton } from 'components/button'
import { FormInputField } from 'components/field'
import Modal, { ModalGutter } from 'components/modal'
import Form, { FormMessage } from 'controls/form'
import useOperation from 'hooks/useOperation'
import deleteUser from 'operations/deleteUser'
import { colors } from 'theme'

const P = styled.p`
  color: ${props => props.color || colors.text.default};
  font-size: 0.9rem;
  margin: 1rem 0;
`

export default function AccountDeleteModal({ open, onClose }) {
  let operation = useOperation(deleteUser)

  return (
    <Modal
      open={open}
      title="Delete my account"
      onClose={operation.busy ? undefined : onClose}>
      <ModalGutter>
        <Form validate={operation.validate} onSubmit={operation.invoke}>
          <P>
            Deleting your account will immediately cancel any existing wig
            subscription, and will remove all your casts, vouches and comments.
            It will also free up your username to be taken by someone else.
          </P>
          <P>
            <strong
              css={css`
                font-weight: bold;
              `}>
              This cannot be undone.
            </strong>{' '}
            To be absolutely sure, please confirm by typing your username below.
          </P>
          <P>We'll be sorry to see you go.</P>
          <FormMessage except="username">
            {({ issue }) => issue && <P color={colors.text.warning}>{issue}</P>}
          </FormMessage>
          <FormInputField
            name="username"
            label="Type the username of your account"
          />
          <FormSubmitButton
            busy={operation.busy}
            disabled={operation.busy}
            onClick={operation.invoke}
            css={css`
              width: 100%;
            `}>
            Delete my acocunt
          </FormSubmitButton>
        </Form>
      </ModalGutter>
    </Modal>
  )
}