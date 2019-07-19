import React from 'react'
import { css } from 'styled-components/macro'
import { mount, route } from 'navi'

import { Spinner } from 'components/loading'
import { colors, media } from 'theme'

export function Loading() {
  return (
    <div
      css={css`
        position: fixed;
        height: 4rem;
        width: 4rem;
        top: calc(50% - 2rem);
        margin: 0 auto;

        left: calc(50%);
        ${media.phoneOnly`
        left: calc(50% - 2rem);
        `}
      `}>
      <Spinner
        backgroundColor={colors.structure.wash}
        color={colors.ink.light}
      />
    </div>
  )
}

const loadingRoute = route({
  data: {
    loading: true,
  },
  view: <Loading />,
})

export default mount({
  '/': loadingRoute,
  '/:wildcard': loadingRoute,
})
