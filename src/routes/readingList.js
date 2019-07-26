import {
  compose,
  lazy,
  map,
  mount,
  redirect,
  route,
  withData,
  withView,
} from 'navi'
import React, { useEffect, useState } from 'react'
import { combineReducers, createStore } from 'redux'
import {
  useNavigation,
  useCurrentRoute,
  useViewElement,
  useActive,
} from 'react-navi'
import { css } from 'styled-components/macro'

import { UserAvatar } from 'components/avatar'
import { UnreadBadgeWrapper } from 'components/badge'
import { LogoImage } from 'components/brand'
import { IconButton } from 'components/button'
import {
  LayoutHeaderSection,
  LayoutTwinColumns,
  LayoutLeftColumnContentScroller,
} from 'components/layout'
import {
  List,
  ListItemLink,
  ListItemIconButton,
  ListItemImage,
  ListItemText,
} from 'components/list'
import { MenuItem } from 'components/menu'
import { PopupProvider, PopupMenu, PopupTrigger } from 'components/popup'
import SearchForm from 'components/searchForm'
import { Section } from 'components/sections'
import { colors, mediaQueries } from 'theme'
import mountByMedia from 'utils/mountByMedia'
import useLatestStoreState from 'hooks/useLatestStoreState'
import { useCurrentUser } from 'context'

// Use a redux store to keep track of state that is shared across the index
// header and its body, as they can mounted in different parts of the tree.
function isEditingReducer(state = false, action) {
  switch (action.type) {
    case 'edit':
      return true
    case 'reset':
      return false
    case 'stop-edit':
      return false
    default:
      return state
  }
}
const store = createStore(
  combineReducers({
    isEditing: isEditingReducer,
  }),
)

function Read(props) {
  let route = useCurrentRoute()
  let view = useViewElement()
  let { isEditing } = useLatestStoreState(store)

  return (
    <LayoutTwinColumns
      transitionKey={route.url.href}
      visibleColumnOnPhone={view ? 'right' : 'left'}
      rightBackgroundOnTabletPlus={!!view}
      left={
        <>
          <LayoutHeaderSection index />
          <LayoutLeftColumnContentScroller>
            <Section>
              <List>
                <ListItemLink href="/recent">
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
            </Section>
            <Section title="Your Reading List">
              <List>
                <ListItemLink href="/jkn">
                  <ListItemImage>
                    <UnreadBadgeWrapper count={3}>
                      <UserAvatar
                        size="2.25rem"
                        user={{
                          photoURL:
                            'https://firebasestorage.googleapis.com/v0/b/vouchchat.appspot.com/o/avatars%2Fvu8UeUrN84MVTo0IIBPaAfoJ5tA2%2Fuser.jpg?alt=media&token=42190743-15df-4603-a08b-243f549ab035',
                        }}
                      />
                    </UnreadBadgeWrapper>
                  </ListItemImage>
                  <ListItemText
                    title="James K Nelson"
                    description="Look at me I'm saying silly things"
                    meta={!isEditing && '1 day ago'}
                  />
                  {isEditing && (
                    <ListItemIconButton glyph="trash" tooltip="Remove" />
                  )}
                </ListItemLink>
                <ListItemLink href="/frontarm">
                  <ListItemImage>
                    <UnreadBadgeWrapper count={1}>
                      <UserAvatar size="2.25rem" />
                    </UnreadBadgeWrapper>
                  </ListItemImage>
                  <ListItemText
                    title="Frontend Armory"
                    description="Learn to build vouch.chat with React & Bacon"
                    meta={!isEditing && '3 days ago'}
                  />
                  {isEditing && (
                    <ListItemIconButton glyph="trash" tooltip="Remove" />
                  )}
                </ListItemLink>
              </List>
            </Section>
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
  let isViewingSearch = useActive('/search')

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
        if (isViewingSearch) {
          navigation.navigate('/')
        }
      }}
      onChange={setQuery}
      onSubmit={() => {
        navigation.navigate('/search?q=' + encodeURIComponent(query))
      }}
    />
  )
}

function ReadingListHeaderActions() {
  let currentUser = useCurrentUser()
  let { isEditing } = useLatestStoreState(store)

  useEffect(
    () => () =>
      store.dispatch({
        type: 'reset',
      }),
    [],
  )

  return isEditing ? (
    <IconButton
      color={colors.ink.black}
      glyph="cross2"
      onClick={() => {
        store.dispatch({
          type: 'stop-edit',
        })
      }}
      size="1.5rem"
      style={{ width: '3.25rem' }}
    />
  ) : (
    <PopupProvider triggerOnFocus triggerOnSelect>
      <PopupTrigger>
        {ref => (
          <IconButton
            color={currentUser !== null ? colors.ink.black : colors.ink.light}
            glyph="cog"
            ref={ref}
            size="1.5rem"
            style={{ width: '3.25rem' }}
          />
        )}
      </PopupTrigger>
      <PopupMenu placement="bottom">
        <MenuItem
          onClick={() => {
            store.dispatch({
              type: 'edit',
            })
          }}>
          Edit
        </MenuItem>
      </PopupMenu>
    </PopupProvider>
  )
}

export default compose(
  withView(({ params }) => <Read query={params.q} />),
  withData((context, params) => ({
    layoutIndexHeaderActions: <ReadingListHeaderActions />,
    layoutIndexHeaderTitle: <ReadingListSearch query={params.q} />,
    layoutIndexPathname: '/',
  })),
  mount({
    '/': mountByMedia({
      default: route({
        data: {
          layoutShowIndexOnPhone: true,
        },
        title: 'Reading List',
      }),
      [mediaQueries.tabletPlus]: redirect('./recent'),
    }),

    // The `readList` route can route just by having a username param on
    // the params (so long as it's not also on the query).
    '/:username': map(({ params, query }) => {
      if (params.username && !query.username) {
        return lazy(() => import('./profile'))
      }
    }),

    '/search': route({
      getTitle: ({ params }) =>
        params.q ? `Search for "${decodeURIComponent(params.q)}"` : 'Search',
      view: <div />,
    }),
    '/recent': route({
      title: 'Recent Activity',
      view: (
        <>
          <LayoutHeaderSection />
          Test
        </>
      ),
    }),
  }),
)
