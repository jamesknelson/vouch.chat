import React from 'react'
import styled from 'styled-components/macro'

import { IconButton, LoginButton, RegisterButton } from 'components/button'
import Card from 'components/card'
import { colors, dimensions, media } from 'theme'

export const StyledAuthFooter = styled(Card)`
  align-items: center;
  border-width: 1px 0 0 0;
  border-radius: 0;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  height: ${dimensions.bar};
  z-index: 9999;

  left: 0;
  padding: 0 1rem;
  width: 100%;
  ${media.tabletPlus`
    left: ${dimensions.bar};
    padding: 0 2rem;
    width: calc(100% - ${dimensions.bar});
  `}
`

export const StyledAuthFooterButtons = styled.div`
  display: flex;

  > * {
    margin-left: 0.5rem;
  }
`

export const StyledAuthFooterCloseButton = styled(IconButton)`
  margin-right: 1rem;
  ${media.tabletPlus`
    margin-right: 2rem;
  `}
`

export const AuthFooterCloseButton = props => (
  <IconButton
    glyph="cross2"
    size="1.25rem"
    color={colors.ink.light}
    {...props}
  />
)

export const StyledAuthFooterMessage = styled.p`
  color: ${colors.text.secondary};
  flex: 1;
  font-size: 0.8rem;
  line-height: 1rem;

  ${media.tabletPlus`
    font-size: 0.9rem;
  `}
`

export const LayoutAuthFooter = props => (
  <StyledAuthFooter {...props}>
    <AuthFooterCloseButton onClick={props.onClose} />
    <StyledAuthFooterMessage>I'll vouch for you.</StyledAuthFooterMessage>
    <StyledAuthFooterButtons>
      <LoginButton />
      <RegisterButton />
    </StyledAuthFooterButtons>
  </StyledAuthFooter>
)

export default LayoutAuthFooter
