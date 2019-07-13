import { route } from 'navi'
import React from 'react'
import { Link } from 'react-navi'

import Button from 'components/button'
import { InputField } from 'components/field'
import { LayoutHeaderSection } from 'components/layout'
import { Gap, Gutter, Section, SectionFooter } from 'components/sections'
import { colors } from 'theme'

function Password() {
  return (
    <>
      <LayoutHeaderSection />
      <Gap />
      <Section>
        <Gutter>
          <Gap size={1} />
          <InputField
            label="Current Password"
            message={
              <>
                Not sure what your password is?{' '}
                <Link href="/recover" style={{ color: colors.ink.black }}>
                  Recover your password here.
                </Link>
              </>
            }
            type="password"
          />
          <InputField label="New Password" type="password" />
          <InputField label="Confirm Password" type="password" />
        </Gutter>
        <SectionFooter>
          <Gutter vertical={1}>
            <Button inline>Update Password</Button>
          </Gutter>
        </SectionFooter>
      </Section>

      <Gap size="50vh" />
    </>
  )
}

export default route({
  title: 'Change Password',
  view: <Password />,
})
