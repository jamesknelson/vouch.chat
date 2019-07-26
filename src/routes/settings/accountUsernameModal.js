import React from 'react'
import { css } from 'styled-components/macro'

import Button, { ButtonLink } from 'components/button'
import { InputField } from 'components/field'
import Modal, { ModalGutter } from 'components/modal'
import { P } from 'components/responsive'
import { colors } from 'theme'
import useUsernameForm from 'hooks/useUsernameForm'

export default function AccountUsernameModal({ open, onClose }) {
  let usernameForm = useUsernameForm({
    onSuccess: onClose,
  })

  return (
    <Modal
      open={open}
      title="Change my username"
      onClose={usernameForm.isSubmitting ? undefined : onClose}>
      <ModalGutter>
        <form onSubmit={usernameForm.onSubmit}>
          <P color={colors.text.warning}>
            Changing your username will allow your old username to be taken by
            someone else.
          </P>
          <InputField
            name="username"
            label="New username"
            maxLength="15"
            message={
              usernameForm.hasSubmitted && usernameForm.issue
                ? usernameForm.message
                : null
            }
            validationState={usernameForm.validationState}
            value={usernameForm.value}
            variant={
              usernameForm.hasSubmitted &&
              usernameForm.issue &&
              usernameForm.issue !== 'premium'
                ? 'warning'
                : null
            }
            style={{ width: '100%' }}
            onChange={usernameForm.onChange}
          />
          {usernameForm.hasSubmitted && usernameForm.issue === 'premium' && (
            <div
              css={css`
                margin-bottom: 1.5rem;
                display: flex;
                justify-content: space-around;
              `}>
              <ButtonLink href="/wigs" size="small">
                Get a wig
              </ButtonLink>
              <Button
                outline
                size="small"
                onClick={usernameForm.onClickAddNumber}>
                Add a number
              </Button>
            </div>
          )}
          <Button
            type="submit"
            busy={usernameForm.isSubmitting}
            disabled={!usernameForm.canSubmit}
            css={css`
              width: 100%;
            `}>
            Change my username
          </Button>
        </form>
      </ModalGutter>
    </Modal>
  )
}
