import { compose, route, withTitle } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import { ButtonLink } from 'components/button'
import Card from 'components/card'
import { Header } from 'components/layout'
import TwinColumnLayout from 'components/twinColumnLayout'
import { colors } from 'theme'
import authenticated from 'utils/authenticated'

function Messages(props) {
  return (
    <TwinColumnLayout
      primary="left"
      left={
        <>
          <Header />
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
          <p>Message</p>
        </>
      }
      right={<h2>Email Settings</h2>}
    />
  )
}

export default compose(
  withTitle('Chat'),
  authenticated(
    route({
      view: <Messages />,
      data: {
        headerActions: (
          <ButtonLink href="/messages/new" outline>
            New
          </ButtonLink>
        ),
      },
    }),
  ),
)
