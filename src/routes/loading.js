import React from 'react'
import { css } from 'styled-components/macro'
import { mount, route } from 'navi'

function Loading() {
  return (
    <div
      css={css`
        margin: 0 auto;
        height: 100%;
        width: 100%;
        padding-right: 1rem;
        position: relative;
        text-align: center;
      `}
    />
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
