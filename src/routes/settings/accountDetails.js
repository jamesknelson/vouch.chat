import { route } from 'navi'
import React from 'react'
import { FormSpy } from 'react-final-form'
import styled, { css } from 'styled-components/macro'

import Button, { FormSubmitButton } from 'components/button'
import { FormInputField } from 'components/field'
import { LayoutHeaderSection } from 'components/layout'
import { TabletPlus } from 'components/media'
import {
  Gap,
  Gutter,
  Section,
  SectionFooter,
  SectionFooterMessage,
} from 'components/sections'
import { useCurrentUser } from 'context'
import { Form, FormMessage } from 'controls/form'
import useOperation from 'hooks/useOperation'
import sendVerificationEmail from 'operations/sendVerificationEmail'
import updateAccountDetails from 'operations/updateAccountDetails'
import { colors } from 'theme'

function AccountDetails() {
  let updateOperation = useOperation(updateAccountDetails)
  let sendVerification = useOperation(sendVerificationEmail)
  let user = useCurrentUser()

  let emailVariant
  let emailMessage
  if (sendVerification.lastValue) {
    emailMessage = 'Your verification email could not be sent.'
    emailVariant = 'warning'
  } else if (sendVerification.lastStatus === 'value') {
    emailMessage = 'Verification email sent. Please check your inbox.'
  } else if (!user.emailVerified) {
    emailMessage = (
      <>
        Your email still needs to be verified. It will not be displayed
        publicly.
        <br />
        <Button
          spinnerColor={colors.brandPrimary}
          size="small"
          disabled={sendVerification.busy}
          busy={sendVerification.busy}
          onClick={sendVerification.invoke}
          style={{ margin: '0.25rem 0' }}
          inline
          outline>
          Send verification email
        </Button>
      </>
    )
  }

  return (
    <>
      <LayoutHeaderSection />
      <Gap />
      <Section>
        <Form
          onSubmit={updateOperation.invoke}
          validate={updateOperation.validate}>
          <Gutter>
            <Gap size={1} />
            <FormSpy>
              {state => (
                <FormInputField
                  label="Username"
                  initialValue={user.username}
                  name="username"
                  hint={`https://vouch.chat/${state.values.username ||
                    user.username}`}
                />
              )}
            </FormSpy>
            <FormInputField
              label="Email"
              initialValue={user.email}
              name="email"
              hint={
                emailMessage || (
                  <>
                    This will <em>not</em> be publicly displayed.
                  </>
                )
              }
              variant={emailVariant}
            />
            {/* <FormSelectField label="Language" name="language">
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </FormSelectField> */}
          </Gutter>
          <SectionFooter>
            <Gutter vertical={1}>
              <FormSubmitButton inline>Save</FormSubmitButton>
              <FormMessage dirty except={['username', 'email']}>
                {({ message, variant }) => (
                  <SectionFooterMessage variant={variant}>
                    {message}
                  </SectionFooterMessage>
                )}
              </FormMessage>
            </Gutter>
          </SectionFooter>
        </Form>
      </Section>

      <Gap />
      <TabletPlus>
        <Gap size={2} />
      </TabletPlus>

      <Section>
        <Gutter
          css={css`
            padding: 0 1rem 1.5rem;
          `}>
          <StyledHeaderSubTitle>Danger Zone</StyledHeaderSubTitle>
          <p
            css={css`
              color: ${colors.ink.black};
              font-size: 90%;
              margin-bottom: 1rem;
            `}>
            This cannot be undone. It will remove your account, your casts, and
            all your vouches.
          </p>
          <Button outline>Delete Account</Button>
        </Gutter>
      </Section>

      <Gap size="50vh" />
    </>
  )
}

const StyledHeaderSubTitle = styled.h2`
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
`

export default route({
  title: 'Account Details',
  view: <AccountDetails />,
})
