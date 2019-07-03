import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import { Header } from 'components/layout'
import { colors } from 'theme'

function Watch(props) {
  return (
    <>
      <Header />
      <div>
        <Card
          css={css`
            color: ${colors.text};
            margin: 1rem;
            padding: 1rem;
          `}>
          <p>
            Add important topics to the sidebar. Get email alerts on topics
            relevant to you.
          </p>
        </Card>
      </div>
    </>
  )
}

export default route({
  title: 'Read',
  view: <Watch />,
})
