import React from 'react'
import { css } from 'styled-components/macro'

import { FormSubmitButton } from 'components/button'
import { FormInputField } from 'components/field'
import Form, { FormMessage } from 'components/form'
import Modal, { ModalGutter } from 'components/modal'
import { P, Strong } from 'components/responsive'
import useOperation from 'hooks/useOperation'
import deleteUser from 'operations/deleteUser'

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
            <Strong>This cannot be undone.</Strong> To be absolutely sure,
            please confirm by typing your username below.
          </P>
          <P>We'll be sorry to see you go.</P>
          <FormMessage>
            {({ message, variant }) => (
              <FormInputField
                name="username"
                label="Type the username of your account"
                message={message}
                variant={variant}
              />
            )}
          </FormMessage>
          <FormSubmitButton
            busy={operation.busy}
            disabled={operation.busy}
            onClick={operation.invoke}
            css={css`
              width: 100%;
            `}>
            Delete my account
          </FormSubmitButton>
        </Form>
      </ModalGutter>
    </Modal>
  )
}
