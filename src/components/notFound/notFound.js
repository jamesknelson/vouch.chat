import React from 'react'

import LayoutPageCard, { Greeting } from 'components/layout/layoutPageCard'

export default function NotFound() {
  return (
    <LayoutPageCard title="404">
      <Greeting>
        The requested page
        <br />
        Seems to have gone for a swim
        <br />
        Like old Harold Holt
      </Greeting>
    </LayoutPageCard>
  )
}
