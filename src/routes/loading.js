import React from 'react'
import { css } from 'styled-components/macro'
import { mount, route } from 'navi'
import { Header } from 'components/layout'

function Loading() {
  return (
    <>
      <Header />
      <div
        css={css`
          margin: 0 auto;
          height: 100%;
          width: 100%;
          position: relative;
          text-align: center;
        `}
      />
    </>
  )
}

const loadingRoute = route({
  view: <Loading />,
})

export default mount({
  '/': loadingRoute,
  '/:wildcard': loadingRoute,
})
