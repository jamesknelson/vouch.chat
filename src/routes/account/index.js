import { route } from 'navi'
import React from 'react'
import TwinColumnLayout from 'components/twinColumnLayout'

// todo: use a main layout header at the top

function Account(props) {
  return (
    <TwinColumnLayout
      primary="left"
      left={<h1>Account Details</h1>}
      right={<h2>Email Settings</h2>}
    />
  )
}

export default route({
  view: <Account />,
})
