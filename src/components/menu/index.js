import React, { useContext } from 'react'
import { Link } from 'react-navi'
import styled from 'styled-components/macro'
import { colors, focusRing, shadows } from 'theme'

const MenuContext = React.createContext({})

const StyledMenu = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.25rem 0;
`

const StyledMenuItem = styled.div`
  color: ${colors.text.secondary};
  display: block;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  position: relative;
  text-align: left;
  width: 100%;
  white-space: nowrap;

  &:hover::after {
    box-shadow: ${shadows.focus(colors.ink.light)};
  }

  ${focusRing('::after', { padding: '-0.25rem' })}
`

export const MenuDivider = styled.hr`
  background-color: ${colors.structure.divider};
  border: none;
  height: 1px;
  margin: 0.25rem 0;
  width: 100%;
`

export const MenuItem = props => {
  let { onDidSelect, readonly } = useContext(MenuContext)

  return (
    <StyledMenuItem
      onClick={event => {
        if (readonly) {
          event.preventDefault()
          event.stopPropagation()
          return
        }

        if (props.onClick) {
          props.onClick(event)
        }
        if (!event.defaultPrevented && onDidSelect) {
          onDidSelect()
        }
      }}
      {...props}
    />
  )
}

export const MenuLink = props => {
  return <MenuItem as={Link} {...props} />
}

export const Menu = React.forwardRef(
  ({ onDidSelect, readonly, ...rest }, ref) => (
    <MenuContext.Provider value={{ onDidSelect, readonly }}>
      <StyledMenu ref={ref} {...rest} />
    </MenuContext.Provider>
  ),
)
