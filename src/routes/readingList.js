import EventEmitter from 'events'
import { compose, mount, redirect, route, withData, withView } from 'navi'
import React, { useEffect, useState } from 'react'
import {
  useNavigation,
  useCurrentRoute,
  useViewElement,
  useActive,
} from 'react-navi'
import styled, { css } from 'styled-components/macro'

import { TagAvatar, UserAvatar } from 'components/avatar'
import { UnreadBadgeWrapper } from 'components/badge'
import { LogoImage } from 'components/brand'
import { IconButton } from 'components/button'
import Icon from 'components/icon'
import {
  LayoutHeaderContent,
  LayoutTwinColumns,
  LayoutLeftColumnContentScroller,
  LayoutSection,
  LayoutHeaderSection,
} from 'components/layout'
import {
  List,
  ListItemLink,
  ListItemImage,
  ListItemText,
  ListItemIconButton,
} from 'components/list'
import SearchForm from 'components/searchForm'
import { colors } from 'theme'

const clearEmitter = new EventEmitter()

const Disc = styled.div`
  display: flex;
  align-items: center;
  border-radius: 9999px;
  background-color: ${colors.ink.wash};
  color: ${colors.control.icon.default};
  justify-content: center;
  ${props => css`
    width: ${props.size};
    height: ${props.size};
  `}
`

function Read(props) {
  let route = useCurrentRoute()
  let view = useViewElement()
  let [query, setQuery] = useState(props.query)

  useEffect(() => {
    if (typeof props.query === 'string') {
      setQuery(props.query || '')
    }
  }, [props.query])

  useEffect(() => {
    let listener = () => {
      setQuery(null)
    }
    clearEmitter.on('clear', listener)
    return () => clearEmitter.off('clear', listener)
  }, [])

  return (
    <LayoutTwinColumns
      transitionKey={route.url.href}
      visibleColumnOnPhone={view ? 'right' : 'left'}
      rightBackgroundOnTabletPlus={!!view}
      left={
        <>
          <LayoutHeaderSection>
            <LayoutHeaderContent index />
          </LayoutHeaderSection>
          <LayoutLeftColumnContentScroller>
            {typeof query === 'string' && (
              <LayoutSection>
                <List>
                  <ListItemLink
                    href={'/read/search?q=' + encodeURIComponent(query)}>
                    <ListItemImage>
                      <Disc size="2.25rem">
                        <Icon glyph="search" size="1.5rem" />
                      </Disc>
                    </ListItemImage>
                    <ListItemText title="Search Results" description={query} />
                    <ListItemIconButton
                      glyph="plus1"
                      tooltip="Add to watchlist"
                    />
                  </ListItemLink>
                </List>
              </LayoutSection>
            )}
            <LayoutSection>
              <List>
                <ListItemLink href="/read/vouched">
                  <ListItemImage>
                    <LogoImage size="2.25rem" />
                  </ListItemImage>
                  <ListItemText
                    title="Recent Activity"
                    description="From people and topics you've vouched for."
                    meta="7 minutes ago"
                  />
                </ListItemLink>
              </List>
            </LayoutSection>
            <LayoutSection title="Your Watchlist">
              <List>
                <ListItemLink href="/read/about/react">
                  <ListItemImage>
                    <UnreadBadgeWrapper count={1}>
                      <TagAvatar size="2.25rem" />
                    </UnreadBadgeWrapper>
                  </ListItemImage>
                  <ListItemText
                    title="#reactjs"
                    description="@devdevcharlie - For my 1st internal Atlassian hackathon, I spent the last 24h trying to implement my brain sensor framework w/ react-beautiful-dnd:"
                    meta="2 hours ago"
                  />
                </ListItemLink>
                <ListItemLink href="/read/by/elonmusk">
                  <ListItemImage>
                    <UnreadBadgeWrapper count={3}>
                      <UserAvatar size="2.25rem" />
                    </UnreadBadgeWrapper>
                  </ListItemImage>
                  <ListItemText
                    title="Elon Musk"
                    description="Rocket fairing returning from space"
                    meta="3 days ago"
                  />
                </ListItemLink>
                <ListItemLink href="/read/about/navi">
                  <ListItemImage>
                    <TagAvatar size="2.25rem" />
                  </ListItemImage>
                  <ListItemText
                    title="#navijs"
                    description="@james - The #navijs docs are really starting to fill out. You can now learn to:"
                    meta="19/12/18"
                  />
                </ListItemLink>
              </List>
            </LayoutSection>
          </LayoutLeftColumnContentScroller>
        </>
      }
      right={view || <div>Pick a topic to read about.</div>}
    />
  )
}

function ReadingListSearch(props) {
  let [query, setQuery] = useState(props.query)
  let navigation = useNavigation()
  let isViewingSearch = useActive('/read/search')

  // Keep the query up to date with navigation.
  useEffect(() => {
    if (typeof props.query === 'string') {
      setQuery(props.query || '')
    }
  }, [props.query])

  return (
    <SearchForm
      placeholder="Search Vouch"
      css={css`
        flex: 1;
        :first-child {
          margin-left: 1rem;
        }
      `}
      value={query || ''}
      onClear={() => {
        setQuery('')
        clearEmitter.emit('clear')
        if (isViewingSearch) {
          navigation.navigate('/read')
        }
      }}
      onChange={setQuery}
      onSubmit={() => {
        navigation.navigate('/read/search?q=' + encodeURIComponent(query))
      }}
    />
  )
}

export default compose(
  withView(({ params }) => <Read query={params.q} />),
  withData(({ context, mountpath, params }) => ({
    layoutIndexHeaderActions: (
      <IconButton
        color={
          context.currentUser !== null ? colors.ink.black : colors.ink.light
        }
        glyph="cog"
        tooltip="Options"
        tooltipPlacement="bottom"
        size="1.5rem"
        style={{ width: '3.25rem' }}
      />
    ),
    layoutIndexHeaderTitle: <ReadingListSearch query={params.q} />,
    layoutIndexPathname: mountpath,
  })),
  mount({
    // During SSR, this should render a blank page, with the actual page
    // being selected on the client via the redirect.
    '/': redirect('./list'),

    // Leaves the right hand side blank if rendered, while displaying
    // only the left hand side if rendered on a single column device.
    '/list': route({
      data: {
        layoutShowIndexOnPhone: true,
      },
      title: 'Reading List',
    }),
    '/search': route({
      getTitle: ({ params }) =>
        params.q ? `Search for "${decodeURIComponent(params.q)}"` : 'Search',
      view: <div />,
    }),
    '/edit': route({
      title: 'Edit',
      view: <div />,
    }),
    '/vouched': route({
      title: 'Recent Activity',
      view: (
        <>
          <LayoutHeaderSection>
            <LayoutHeaderContent />
          </LayoutHeaderSection>
          Test
        </>
      ),
    }),
    '/by/:user': route({
      getTitle: ({ params }) => `@${params.user}`,
      view: (
        <>
          <LayoutHeaderSection>
            <LayoutHeaderContent />
          </LayoutHeaderSection>
          Test
        </>
      ),
    }),
    '/about/:tag': route({
      getTitle: ({ params }) => `#${params.tag}`,
      view: (
        <>
          <LayoutHeaderSection>
            <LayoutHeaderContent />
          </LayoutHeaderSection>
          Test
        </>
      ),
    }),
  }),
)
