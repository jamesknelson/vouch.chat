import { route } from 'navi'
import React from 'react'

function Notifications(props) {
  return (
    <div>
      <p>Notifications.</p>
    </div>
  )
}

export default route({
  view: <Notifications />,
})
