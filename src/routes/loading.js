import React from 'react'
import { css } from 'styled-components/macro'
import { mount, route } from 'navi'
import { Spinner } from 'components/loading'
import { colors } from 'theme'

function Loading() {
  return (
    <div
      css={css`
        margin: 0 auto;
        height: 100%;
        width: 100%;
        position: relative;
        text-align: center;
      `}>
      <Spinner
        color={colors.ink.black}
        backgroundColor={colors.structure.wash}
        borderWidth={3}
        size={'60px'}
        css={css`
          display: inline-block;
          margin-top: 8rem;
        `}
      />
    </div>
  )
}

const loadingRoute = route({
  view: <Loading />,
})

export default mount({
  '/': loadingRoute,
  '/:wildcard': loadingRoute,
})
