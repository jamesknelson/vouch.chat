import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card, { CardHeader } from 'components/card'
import { LayoutHeaderContent } from 'components/layout'
import { List, ListItemLink, ListItemText } from 'components/list'
import { TabletPlus } from 'components/media'
import TwinColumnLayout from 'components/twinColumnLayout'
import { media } from 'theme'

// todo: use a main layout header at the top

function Account(props) {
  return (
    <TwinColumnLayout
      primary="left"
      left={
        <Card
          borders={[false, true]}
          radius={0}
          css={css`
            display: block;
            padding-bottom: 2rem;
            overflow: hidden;

            ${media.phoneOnly`
              background-color: transparent;
            `}
          `}>
          <TabletPlus>
            <CardHeader>
              <LayoutHeaderContent index />
            </CardHeader>
          </TabletPlus>
          <List>
            <ListItemLink href="/settings/account-details">
              <ListItemText title="Account Details" />
            </ListItemLink>
          </List>
        </Card>
      }
      right={
        <Card
          borders={[false, true]}
          radius={0}
          css={css`
            display: block;
            padding-bottom: 2rem;
            overflow: hidden;

            ${media.phoneOnly`
              background-color: transparent;
            `}
          `}>
          <TabletPlus>
            <CardHeader>
              <LayoutHeaderContent />
            </CardHeader>
          </TabletPlus>
          <p>stuff</p>
        </Card>
      }
    />
  )
}

export default route({
  data: {
    indexHeader: {
      title: 'Settings',
    },
  },
  title: 'Account Details',
  view: <Account />,
})
