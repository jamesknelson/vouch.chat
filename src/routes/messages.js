import { compose, route } from 'navi'
import React from 'react'
import { ButtonLink } from 'components/button'
import { List, ListItem } from 'components/list'
import TwinColumnLayout from 'components/twinColumnLayout'
import authenticated from 'utils/authenticated'

function Chat(props) {
  return (
    <TwinColumnLayout
      primary="left"
      left={
        <div>
          <List>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
            <ListItem>Message</ListItem>
          </List>
        </div>
      }
      right={
        <div>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
        </div>
      }
    />
  )
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
