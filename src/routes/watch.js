import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import { colors } from 'theme'

function Watch(props) {
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
          Watch
        </h1>
        <p>
          Add important topics to the sidebar. Get email alerts on topics
          relevant to you.
        </p>
      </Card>
    </div>
  )
}

export default route({
  title: 'Watch',
  view: <Watch />,
})
