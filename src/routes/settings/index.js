import { compose, lazy, mount, redirect, route, withData, withView } from 'navi'
import React from 'react'
import { useCurrentRoute, useViewElement } from 'react-navi'

import {
  LayoutHeaderSection,
  LayoutLeftColumnContentScroller,
  LayoutTwinColumns,
} from 'components/layout'
import { List, ListItemLink, ListItemText } from 'components/list'
import { Section, Gap } from 'components/sections'
import { mediaQueries } from 'theme'
import authenticated from 'utils/authenticated'
import mountByMedia from 'utils/mountByMedia'

function Settings(props) {
  let route = useCurrentRoute()
  let view = useViewElement()

  return (
    <LayoutTwinColumns
      maxLeftColumnWidth="280px"
      transitionKey={!route.data.loading && route.url.href}
      visibleColumnOnPhone={view ? 'right' : 'left'}
      rightBackgroundOnTabletPlus={!!view && !route.data.loading}
      left={
        <>
          <LayoutHeaderSection index />
          <LayoutLeftColumnContentScroller>
            <Gap size={1} />
            <Section>
              <List>
                <ListItemLink href="/settings/account-details">
                  <ListItemText
                    title="Account Details"
                    description="Username, email & language."
                  />
                </ListItemLink>
                <ListItemLink href="/settings/password">
                  <ListItemText
                    title="Password"
                    description="Change or recover your password."
                  />
                </ListItemLink>
                <ListItemLink href="/settings/billing">
                  <ListItemText
                    title="Billing"
                    description="Plan, billing card & history."
                  />
                </ListItemLink>
              </List>
            </Section>
          </LayoutLeftColumnContentScroller>
        </>
      }
      right={!route.data.loading && view}
    />
  )
}

export default authenticated(
  compose(
    withView(<Settings />),
    withData(({ mountpath }) => ({
      layoutIndexHeaderTitle: 'Settings',
      layoutIndexPathname: mountpath,
    })),
    mount({
      '/': mountByMedia({
        default: route({
          data: {
            layoutShowIndexOnPhone: true,
          },
          title: 'Settings',
        }),
        [mediaQueries.tabletPlus]: redirect('./account-details'),
      }),
      '/account-details': lazy(() => import('./accountDetails')),
      '/billing': lazy(() => import('./billing')),
      '/password': lazy(() => import('./password')),
    }),
  ),
)
