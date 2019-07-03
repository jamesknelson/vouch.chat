import { compose, route, withTitle } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import { ButtonLink } from 'components/button'
import Card from 'components/card'
import { Header } from 'components/layout'
import { colors } from 'theme'
import authenticated from 'utils/authenticated'

function Messages(props) {
  return (
    <div>
      <Header />
      <Card
        css={css`
          color: ${colors.text};
          margin: 1rem;
          padding: 1rem;
        `}>
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
      </Card>
    </div>
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
