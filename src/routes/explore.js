import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import { colors } from 'theme'

function Search(props) {
  return (
    <div>
      <Card
        css={css`
          color: ${colors.text};
          margin: 1rem;
          padding: 1rem;
        `}
      />
    </div>
  )
}

export default route({
  title: 'Community',
  view: <Search />,
})
