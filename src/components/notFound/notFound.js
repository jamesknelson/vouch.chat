import React from 'react'

import SmallCardLayout, {
  Greeting,
} from 'components/smallCardLayout/smallCardLayout'

export default function NotFound() {
  return (
    <SmallCardLayout title="404">
      <Greeting>
        The requested page
        <br />
        Seems to have gone for a swim
        <br />
        Like old Harold Holt
      </Greeting>
    </SmallCardLayout>
  )
}
