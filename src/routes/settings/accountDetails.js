import { route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import Button from 'components/button'
import { InputField } from 'components/field'
import { LayoutHeaderSection } from 'components/layout'
import { Gap, Gutter, Section, SectionFooter } from 'components/sections'
import { colors } from 'theme'
import { TabletPlus } from 'components/media'

function AccountDetails() {
  return (
    <>
      <LayoutHeaderSection />
      <Gap />
      <Section>
        <Gutter vertical={0.5}>
          <InputField
            label="Username"
            message="https://vouch.chat/james"
            value="james"
          />
          <InputField
            label="Email"
            message={
              <>
                This will <em>not</em> be publicly displayed.
              </>
            }
            value="james@jamesknelson.com"
          />
          <InputField label="Language" value="English" />
        </Gutter>
        <SectionFooter>
          <Gutter vertical={1}>
            <Button inline>Save</Button>
            <span
              css={css`
                color: ${colors.text.tertiary};
                font-size: 90%;
                margin-left: 1rem;
              `}>
              You have unsaved changes.
            </span>
          </Gutter>
        </SectionFooter>
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
