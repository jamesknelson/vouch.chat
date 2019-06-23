import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import { colors } from 'theme'

function Messages(props) {
  return (
    <div>
      <Card
        css={css`
          color: ${colors.text};
          margin: 1rem;
          padding: 1rem;
        `}>
        <h1
          css={css`
            font-size: 1.4rem;
            font-weight: 800;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          `}>
          Pen
        </h1>
        <p>Message</p>
        <p>Message</p>
        <p>Message</p>
        <p>Message</p>
        <p>Message</p>
      </Card>
    </div>
  )
}

export default route({
  title: 'Messages',
  view: <Messages />,
})