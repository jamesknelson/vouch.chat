import { route } from 'navi'
import React from 'react'

function Messages(props) {
  return (
    <div>
      <h1>Messages</h1>
    </div>
  )
}

export default route({
  view: <Messages />,
})
