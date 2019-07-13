import { route } from 'navi'
import React from 'react'

import { FormSubmitButton, StyledLink } from 'components/button'
import { FormInputField } from 'components/field'
import { LayoutHeaderSection } from 'components/layout'
import {
  Gap,
  Gutter,
  Section,
  SectionFooter,
  SectionFooterMessage,
} from 'components/sections'
import { Form, FormMessage } from 'controls/form'
import useOperation from 'hooks/useOperation'
import updatePassword from 'operations/updatePassword'
import { colors } from 'theme'

function Password() {
  let operation = useOperation(updatePassword)

  return (
    <>
      <LayoutHeaderSection />
      <Gap />
      <Section>
        <Form onSubmit={operation.invoke} validate={operation.validate}>
          <Gutter>
            <Gap size={1} />
            <FormInputField
              label="Current Password"
              name="currentPassword"
              type="password"
              hint={
                <>
                  Not sure what your password is?{' '}
                  <StyledLink
                    href="/recover"
                    style={{ color: colors.ink.black }}>
                    Recover your password here.
                  </StyledLink>
                </>
              }
            />
            <FormInputField
              label="New Password"
              type="password"
              name="password"
            />
            <FormInputField
              label="Confirm Password"
              type="password"
              name="passwordConfirmation"
            />
          </Gutter>
          <SectionFooter>
            <Gutter vertical={1}>
              <FormSubmitButton inline>Update Password</FormSubmitButton>
              <FormMessage
                dirty="You have unsaved changes."
                success="Your password was successfully changed."
                except={[
                  'password',
                  'currentPassword',
                  'passwordConfirmation',
                ]}>
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

      <Gap size="50vh" />
    </>
  )
}

export default route({
  title: 'Change Password',
  view: <Password />,
})
