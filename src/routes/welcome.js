import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import { colors } from 'theme'

function Welcome(props) {
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
          Welcome
        </h1>
      </Card>
    </div>
  )
}

export default route({
  title: 'Welcome!',
  view: <Welcome />,
})
