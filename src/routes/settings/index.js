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
      transitionKey={
        // Transition on just the pathname, so that screens can do
        // internal navigation with query params
        !route.data.loading && route.url.pathname
      }
      visibleColumnOnPhone={view ? 'right' : 'left'}
      rightBackgroundOnTabletPlus={!!view && !route.data.loading}
      left={
        <>
          <LayoutHeaderSection index />
          <LayoutLeftColumnContentScroller>
            <Gap size={1} />
            <Section>
              <List>
                <ListItemLink href="/settings/profile">
                  <ListItemText
                    title="Profile"
                    description="Name, photo & bio"
                  />
                </ListItemLink>
                <ListItemLink href="/settings/account">
                  <ListItemText
                    title="Account"
                    description="Username & email"
                  />
                </ListItemLink>
                <ListItemLink href="/settings/password">
                  <ListItemText
                    title="Password"
                    description="Change or recover your password"
                  />
                </ListItemLink>
                <ListItemLink href="/settings/billing">
                  <ListItemText
                    title="Billing"
                    description="Your subscription & billing card"
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
        [mediaQueries.tabletPlus]: redirect('./profile'),
      }),
      '/account': lazy(() => import('./account')),
      '/billing': lazy(() => import('./billing')),
      '/password': lazy(() => import('./password')),
      '/profile': lazy(() => import('./profile')),
    }),
  ),
)
