import React from 'react'

const LayoutContext = React.createContext({
  footerOverlayHeight: '0px',

  // hides the footer by default
  // on phone, hides the navbar and positions the header relatively so it can
  // be scrolled.
  minimal: false,

  // if given, a back button will be shown in the index header content on
  // mobile, linking to this pathname
  indexPathname: undefined,

  indexHeaderActions: undefined,
  indexHeaderTitle: undefined,

  headerActions: undefined,
  headerTitle: undefined,

  showIndexOnPhone: false,

  // shows even on desktop in the right header
  // uses history.back instead of going "up"
  // note that this won't disable the back arrow added by `indexPathname`,
  showHistoryBack: false,
})

export default LayoutContext
