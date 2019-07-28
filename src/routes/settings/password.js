import { route } from 'navi'
import React from 'react'

import { FormSubmitButton, StyledLink } from 'components/button'
import { FormInputField } from 'components/field'
import { Form, FormMessage } from 'components/form'
import { LayoutHeaderSection } from 'components/layout'
import { Box, Gap } from 'components/responsive'
import { Section, SectionFooter } from 'components/sections'
import useOperation from 'hooks/useOperation'
import updatePassword from 'operations/updatePassword'
import { colors } from 'theme'

function Password() {
  let operation = useOperation(updatePassword)

  return (
    <>
      <LayoutHeaderSection />
      <Section>
        <Form onSubmit={operation.invoke} validate={operation.validate}>
          <Box paddingX="1rem">
            <Gap />
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
          </Box>
          <SectionFooter>
            <Box padding="1rem">
              <FormSubmitButton inline>Update Password</FormSubmitButton>
              <FormMessage
                as="span"
                dirty
                success="Your password was successfully changed."
                except={['password', 'currentPassword', 'passwordConfirmation']}
                marginLeft="1rem"
              />
            </Box>
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
