import React from 'react'
import styled from 'styled-components/macro'

import useMediaQuery from 'hooks/useMedia'
import { media, mediaQueries } from 'theme'

export const StyledPhoneOnly = styled.div`
  ${media.tabletPlus`
    display: none !important;
  `}
`

export const StyledTabletPlus = styled.div`
  ${media.phoneOnly`
    display: none !important;
  `}
`

// Note: on server side, the result will always be rendered, but will be
// hidden using a CSS media query.

export const PhoneOnly = props => {
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  return isPhone === undefined || isPhone ? (
    <StyledPhoneOnly {...props} />
  ) : null
}

export const TabletPlus = props => {
  let isTabletPlus = useMediaQuery(mediaQueries.tabletPlus)
  return isTabletPlus === undefined || isTabletPlus ? (
    <StyledTabletPlus {...props} />
  ) : null
}

// Higher Order Component forms are useful as they allow us to add the CSS
// fallback styles to a component without needing an extra wrapping div.

export const phoneOnly = component => {
  return function PhoneOnly(props) {
    let isPhone = useMediaQuery(mediaQueries.phoneOnly)
    return isPhone === undefined || isPhone ? (
      <StyledPhoneOnly {...props} as={component} />
    ) : null
  }
}

export const tabletPlus = component => {
  return function TabletPlus(props) {
    let isTabletPlus = useMediaQuery(mediaQueries.tabletPlus)
    return isTabletPlus === undefined || isTabletPlus ? (
      <StyledTabletPlus {...props} as={component} />
    ) : null
  }
}
