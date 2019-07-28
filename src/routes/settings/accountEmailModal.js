import React from 'react'
import { css } from 'styled-components/macro'

import { FormSubmitButton, StyledLink } from 'components/button'
import { FormInputField } from 'components/field'
import Form, { FormMessage } from 'components/form'
import Modal, { ModalGutter } from 'components/modal'
import useOperation from 'hooks/useOperation'
import updateEmail from 'operations/updateEmail'
import { colors } from 'theme'

export default function AccountEmailModal({ open, onClose }) {
  let operation = useOperation(updateEmail, {
    onSuccess: onClose,
  })

  return (
    <Modal
      open={open}
      title="Change my email"
      onClose={operation.busy ? undefined : onClose}>
      <ModalGutter style={{ paddingTop: '1rem' }}>
        <Form validate={operation.validate} onSubmit={operation.invoke}>
          <FormInputField
            name="email"
            type="email"
            label="New email"
            hint="This will not be visible to the public."
          />
          <FormInputField
            name="password"
            type="password"
            label="Current password"
            hint={
              <>
                Not sure what your password is?{' '}
                <StyledLink href="/recover" style={{ color: colors.ink.black }}>
                  Recover your password here.
                </StyledLink>
              </>
            }
          />
          <FormMessage except={['email', 'password']} marginTop="1rem" />
          <FormSubmitButton
            busy={operation.busy}
            disabled={operation.busy}
            onClick={operation.invoke}
            css={css`
              width: 100%;
            `}>
            Change my email
          </FormSubmitButton>
        </Form>
      </ModalGutter>
    </Modal>
  )
}
