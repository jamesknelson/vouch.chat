import { rgba } from 'polished'
import React from 'react'
import { useLinkProps, useCurrentRoute, useLoadingRoute } from 'react-navi'
import styled, { css } from 'styled-components/macro'

import { IconButton } from 'components/button'
import { colors, easings, focusRing } from 'theme'

export const ListSection = ({ children, title, ...rest }) => (
  <>
    <ListHeading>{title}</ListHeading>
    <List
      css={css`
        background-color: ${colors.structure.bg};
        box-shadow: 0 0 12px 1px ${rgba(colors.structure.wash, 0.66)},
          0 0 10px 2px ${rgba(colors.structure.wash, 0.33)} inset;
      `}
      {...rest}>
      {children}
    </List>
  </>
)

export const ListHeading = styled.h4`
  border-bottom: 1px solid ${colors.structure.divider};
  color: ${colors.text.subHeading};
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.9rem 1rem 0.1rem;
  text-transform: uppercase;
`

const StyledListItem = styled.div`
  color: ${colors.text.default};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  overflow: hidden;
  padding: 0 0.5rem;
  position: relative;
  text-align: left;
  width: 100%;
  white-space: nowrap;

  ::before {
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  & + & {
    border-top: 1px solid ${colors.structure.divider};
  }

  ${focusRing('::before', { padding: '-0.25rem' })}
`

const StyledListItemActiveIndicator = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color 200ms ${easings.easeOut};
  top: calc(50% - 1px);
  right: -2px;

  ${props =>
    props.active &&
    `
      background-color: ${colors.ink.black};
    `}
`

export const ListItem = ({ active, children, ...rest }) => {
  return (
    <StyledListItem {...rest}>
      {children}
      <StyledListItemActiveIndicator active={active} />
    </StyledListItem>
  )
}

export const ListItemLink = ({ children, className, href, style, ...rest }) => {
  let currentRoute = useCurrentRoute()
  let loadingRoute = useLoadingRoute()
  let route = loadingRoute || currentRoute
  let routePathname = route.url.pathname
  console.log(routePathname, href)
  let active = href === routePathname
  let linkProps = useLinkProps({ href, ...rest })

  return (
    <ListItem
      as="a"
      active={active}
      children={children}
      className={className}
      style={style}
      {...linkProps}
    />
  )
}

export const ListItemImage = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 0.75rem 0.5rem;
  border-radius: 9999px;
`

export const ListItemSecondaryAction = ({ children }) => (
  <>
    <div
      css={css`
        display: flex;
        align-self: stretch;
        align-items: stretch;
        justify-items: stretch;
        min-height: 2.5rem;
        margin-left: -0.5rem;
        margin-right: -0.5rem;

        :hover + * {
          opacity: 1;
        }

        > * {
          flex-grow: 1;
        }
      `}
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
      }}>
      {children}
    </div>
    <div
      css={css`
        position: absolute;
        content: ' ';
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1 !important;
        opacity: 0;
        transition: opacity 200ms ${easings.easeOut};
        background-color: ${colors.structure.bg};
      `}
    />
  </>
)

export const ListItemIconButton = ({ className, style, ...rest }) => (
  <ListItemSecondaryAction
    className={className}
    style={style}
    css={css`
      width: 3.25rem;
    `}>
    <IconButton {...rest} size="1.25rem" />
  </ListItemSecondaryAction>
)

const StyledItemText = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  flex-basis: 0;
  flex-direction: column;
  font-size: 0.9rem;
  padding: 0.75rem 0.5rem;
  position: relative;
  text-align: left;
  width: 100%;
  white-space: nowrap;
`

const StyledTopLine = styled.div`
  display: flex;
  width: 100%;
`

const StyledItemTitle = styled.div`
  color: ${colors.text.default};
  font-weight: 600;
  line-height: 1rem;
  padding-top: 0.2rem;
  overflow: hidden;
  flex-grow: 1;
  text-overflow: ellipsis;
`

const StyledItemMeta = styled.div`
  align-self: center;
  line-height: 1.1rem;
  flex-shrink: 0;
  flex-grow: 0;
  font-weight: 400;
  font-size: 0.8rem;
  color: ${colors.text.tertiary};
`

const StyledItemDescription = styled.div`
  color: ${colors.text.tertiary};
  font-weight: 400;
  line-height: 1.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ListItemText = ({ title, description, meta, ...rest }) => (
  <StyledItemText {...rest}>
    <StyledTopLine>
      <StyledItemTitle>{title}</StyledItemTitle>
      {meta && <StyledItemMeta>{meta}</StyledItemMeta>}
    </StyledTopLine>
    {description && (
      <StyledItemDescription>{description}</StyledItemDescription>
    )}
  </StyledItemText>
)

export const List = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export default List
