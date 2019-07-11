import React from 'react'
import { useCurrentRoute } from 'react-navi'
import styled from 'styled-components/macro'

import { LoginButton, RegisterButton } from 'components/button'
import { TabletPlus } from 'components/media'
import { dimensions } from 'theme'

export const StyledHeaderTitle = styled.h1`
  flex: 1;
  font-size: 1.2rem;
  font-weight: 700;
`

export const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledTabletPlusHeader = styled(TabletPlus)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${dimensions.bar};
  width: 100%;
  padding: 1rem 0 1rem 1rem;
`

export const LayoutHeaderContent = ({ children, index, ...rest }) => {
  let {
    data: { auth, header, indexHeader },
    title: routeTitle,
    url,
  } = useCurrentRoute()

  let actions =
    (index ? indexHeader && indexHeader.actions : header && header.actions) ||
    children
  let title = !auth && (index ? indexHeader && indexHeader.title : routeTitle)

  if (auth) {
    actions = !/^\/login/.test(url.pathname) ? (
      <LoginButton />
    ) : (
      <RegisterButton />
    )
  }

  return (
    <StyledTabletPlusHeader {...rest}>
      {React.isValidElement(title) ? (
        title
      ) : (
        <StyledHeaderTitle>{title}</StyledHeaderTitle>
      )}
      <StyledHeaderActions>{actions}</StyledHeaderActions>
    </StyledTabletPlusHeader>
  )
}
