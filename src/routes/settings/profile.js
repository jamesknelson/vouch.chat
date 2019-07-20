import { route } from 'navi'
import React from 'react'

import { FormSubmitButton } from 'components/button'
import { FormInputField } from 'components/field'
import { LayoutHeaderSection } from 'components/layout'
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
import updateProfile from 'operations/updateProfile'

function Profile() {
  let updateOperation = useOperation(updateProfile)
  let user = useCurrentUser()

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
            <FormInputField
              label="Name"
              initialValue={user.displayName}
              name="displayName"
              hint="Your publically displayed name"
            />
            <FormInputField
              label="Bio"
              initialValue={user.bio}
              name="bio"
              hint="A little bit about you"
            />
          </Gutter>
          <SectionFooter>
            <Gutter vertical={1}>
              <FormSubmitButton inline>Save</FormSubmitButton>
              <FormMessage dirty except={['displayName', 'bio']}>
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
  title: 'Profile',
  view: <Profile />,
})
