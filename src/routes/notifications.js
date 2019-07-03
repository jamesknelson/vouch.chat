import { compose, route, withTitle } from 'navi'
import React from 'react'
import authenticated from 'utils/authenticated'

function Notifications(props) {
  return (
    <div>
      <p>Notifications.</p>
    </div>
  )
}

export default compose(
  withTitle('Alerts'),
  authenticated(
    route({
      view: <Notifications />,
    }),
  ),
)
