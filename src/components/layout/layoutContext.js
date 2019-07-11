import React from 'react'

const LayoutContext = React.createContext({
  footerOverlayHeight: 0,

  indexHeader: undefined,

  // null indicates no header
  // undefined indicates a default header based on page title
  header: undefined,

  useMinimalHeaderOnPhone: false,

  // shows even on desktop in the right header
  // uses history.back instead of going "up"
  showBackInHeader: false,
})

export default LayoutContext
