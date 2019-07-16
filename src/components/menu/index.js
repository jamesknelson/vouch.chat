import React, { useContext } from 'react'
import { Link } from 'react-navi'
import styled from 'styled-components/macro'
import { colors, focusRing } from 'theme'

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

  ${focusRing('::after', { padding: '-0.25rem' })}
`

export const MenuDivider = styled.hr`
  background-color: ${colors.structure.divider};
  border: none;
  height: 1px;
  margin: 0.25rem 0;
  width: 100%;
`

export const MenuItem = ({ onDidSelect, onClick, ...rest }) => {
  let context = useContext(MenuContext)

  if (!onDidSelect) {
    onDidSelect = context.onDidSelect
  }

  return (
    <StyledMenuItem
      onClick={event => {
        if (onClick) {
          onClick(event)
        }
        if (!event.defaultPrevented && onDidSelect) {
          onDidSelect()
        }
      }}
      {...rest}
    />
  )
}

export const MenuLink = props => {
  return <MenuItem as={Link} {...props} />
}

export const Menu = React.forwardRef(
  ({ children, onDidSelect = undefined, ...rest }, ref) => (
    <MenuContext.Provider value={{ onDidSelect }}>
      <StyledMenu ref={ref} {...rest}>
        {children}
      </StyledMenu>
    </MenuContext.Provider>
  ),
)
