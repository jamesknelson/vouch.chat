import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components/macro'
import './scrollContainer.css'
import useMediaQuery from 'hooks/useMedia'
import { mediaQueries } from 'theme'

const StyledScrollContainer = styled(PerfectScrollbar)`
  overflow: auto;
`

function ScrollContainer(props) {
  // Use the native scrollbar on mobile.
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  let asProps = {}
  if (isPhone) {
    asProps.as = 'div'
  }
  return <StyledScrollContainer {...asProps} {...props} />
}

export default ScrollContainer
