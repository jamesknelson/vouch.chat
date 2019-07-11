import { route } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'
import Card from 'components/card'
import TwinColumnLayout from 'components/twinColumnLayout'
import { colors } from 'theme'

function Profile(props) {
  return (
    <TwinColumnLayout
      left={
        <div
          css={css`
            display: block;
          `}>
          <Card
            css={css`
              margin: 1rem 0;
              padding: 1rem;
            `}>
            <h1
              css={css`
                color: ${colors.text};
                font-size: 1.4rem;
                font-weight: 800;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              `}>
              @{props.username}
            </h1>
          </Card>
        </div>
      }
      right={null}
    />
  )
}

export default route({
  title: 'Profile',
  getView: ({ params }) => <Profile username={params.username} />,
})
