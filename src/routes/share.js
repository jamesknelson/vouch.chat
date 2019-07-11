import { compose, route, withTitle } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'

import Button from 'components/button'
import {
  LayoutSingleColumn,
  LayoutHeaderSection,
  LayoutHeaderContent,
} from 'components/layout'
import authenticated from 'utils/authenticated'

function Pen(props) {
  return (
    <LayoutSingleColumn>
      <LayoutHeaderSection>
        <LayoutHeaderContent />
      </LayoutHeaderSection>
      <h1
        css={css`
          font-size: 1.4rem;
          font-weight: 800;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        `}>
        Pick: Note or Topic Card
      </h1>
      <Button>Vouch</Button>
    </LayoutSingleColumn>
  )
}

export default compose(
  withTitle('Create'),
  authenticated(
    route({
      view: <Pen />,
    }),
  ),
)
