import { compose, route } from 'navi'
import React from 'react'
import { ButtonLink } from 'components/button'
import authenticated from 'utils/authenticated'

function Chat(props) {
  return <div />
}

export default compose(
  authenticated(
    route({
      view: <Chat />,
      data: {
        indexHeader: {
          actions: (
            <ButtonLink
              href="/messages/new"
              outline
              style={{ marginRight: '0.75rem' }}>
              New
            </ButtonLink>
          ),
          title: 'Chat',
        },
      },
    }),
  ),
)
