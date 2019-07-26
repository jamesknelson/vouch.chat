import { route } from 'navi'
import React from 'react'
import styled from 'styled-components/macro'

import Button, { StyledLink } from 'components/button'
import { LayoutHeaderSection } from 'components/layout'
import { Box, Gap, P } from 'components/responsive'
import { Section } from 'components/sections'
import { useCurrentUser } from 'context'
import useOperation from 'hooks/useOperation'
import useToggle from 'hooks/useToggle'
import sendVerificationEmail from 'operations/sendVerificationEmail'
import { colors } from 'theme'

import AccountDeleteModal from './accountDeleteModal'
import AccountEmailModal from './accountEmailModal'
import AccountUsernameModal from './accountUsernameModal'

// React doesn't define this during development
const PublicURL = process.env.PUBLIC_URL || 'https://vouch.chat/'

const Message = styled.span`
  color: ${props => colors.text[props.variant || 'default']};
  font-size: 80%;
  margin: 1rem 0;
`

const Strong = styled.strong`
  font-weight: bold;
`

function Account() {
  let [isUsernameModalOpen, showUsernameModal, hideUsernameModal] = useToggle()
  let [isEmailModalOpen, showEmailModal, hideEmailModal] = useToggle()
  let [isDeleteModalOpen, showDeleteModal, hideDeleteModal] = useToggle()

  let sendVerificationOperation = useOperation(sendVerificationEmail)
  let user = useCurrentUser()

  let emailMessageVariant
  let emailMessage
  if (sendVerificationOperation.error) {
    emailMessage = 'Your verification email could not be sent.'
    emailMessageVariant = 'warning'
  } else if (sendVerificationOperation.status === 'success') {
    emailMessage = 'Verification email sent. Please check your inbox.'
  }

  const profileURL = user.username && PublicURL + '@' + user.username

  return (
    <>
      <LayoutHeaderSection />
      <Gap size={{ default: 1, tabletPlus: 0 }} />

      <Section title="Username">
        <Box padding="0 1rem 1rem">
          <P>
            Your username is <Strong>@{user.username}</Strong>, and your profile
            can be accessed at{' '}
            <StyledLink href={profileURL}>{profileURL}</StyledLink>.
          </P>
          <P>
            You can change your username, but doing so will allow your old
            username to be taken by someone else.
          </P>
          <Button outline size="small" onClick={showUsernameModal}>
            Change my username
          </Button>
          <AccountUsernameModal
            open={isUsernameModalOpen}
            onClose={hideUsernameModal}
          />
        </Box>
      </Section>

      <Gap />

      <Section title="Email address">
        <Box padding="0 1rem 1rem">
          <P>
            Your email address is <Strong>{user.email}</Strong>. This will{' '}
            <em>not</em> be publicly displayed.
          </P>
          {!user.emailVerified && (
            <P>
              <Strong>Your email address is unverified.</Strong>
            </P>
          )}
          <Button inline outline size="small" onClick={showEmailModal}>
            Change my email
          </Button>
          <AccountEmailModal open={isEmailModalOpen} onClose={hideEmailModal} />
          &nbsp;&nbsp;
          {!user.emailVerified && (
            <Button
              spinnerColor={colors.brandPrimary}
              size="small"
              disabled={
                sendVerificationOperation.busy ||
                sendVerificationOperation.status === 'success'
              }
              busy={sendVerificationOperation.busy}
              onClick={sendVerificationOperation.invoke}
              style={{ margin: '0.25rem 0' }}
              inline
              outline>
              Resend verification email
            </Button>
          )}
          {emailMessage && (
            <P>
              <Message variant={emailMessageVariant}>{emailMessage}</Message>
            </P>
          )}
        </Box>
      </Section>

      <Gap />

      <Section title="Danger Zone">
        <Box padding="0 1rem 1rem">
          <P>
            This cannot be undone. It will remove your account, your casts, and
            all your vouches.
          </P>
          <Button outline size="small" onClick={showDeleteModal}>
            Delete Account
          </Button>
          <AccountDeleteModal
            open={isDeleteModalOpen}
            onClose={hideDeleteModal}
          />
        </Box>
      </Section>

      <Gap size="50vh" />
    </>
  )
}

export default route({
  title: 'Account Details',
  view: <Account />,
})
