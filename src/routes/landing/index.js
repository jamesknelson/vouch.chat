import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import { colors } from 'theme'

function Landing(props) {
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
            font-size: 1.3rem;
            font-weight: 900;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          `}>
          VOUCH.CHAT
        </h1>
        <p>The Slow Social Network</p>
      </Card>
    </div>
  )
}

export default route({
  title: 'Home',
  view: <Landing />,
})
