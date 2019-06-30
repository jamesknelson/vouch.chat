import React from 'react'
import { rgba } from 'polished'
import styled from 'styled-components/macro'
import { Control } from 'components/control'
import Icon from 'components/icon'
import { colors, easings } from 'theme'

const StyledSearchInput = styled.input`
  background-color: transparent;
  color: ${colors.text.default};
  flex: 1;
  font-size: 0.9rem;
  padding: 0.75rem;
  border-radius: 9999px;
`

const StyledSearchButton = styled.button`
  background-color: transparent;
  color: ${colors.control.icon.default};
  cursor: pointer;
  border-radius: 1rem;
  margin-right: 0.75rem;

  transition: text-shadow 200ms ${easings.easeOut},
    color 200ms ${easings.easeOut};

  :active,
  ${StyledSearchInput}:focus ~ & {
    color: ${colors.focus.default};
    text-shadow: 0 0 3px ${rgba(colors.focus.default, 0.5)};
  }
`

export function SearchForm({
  className,
  style,
  label,
  id,
  onChange,
  onSubmit,
  ...props
}) {
  return (
    <Control
      as="form"
      id={id}
      label={label}
      className={className}
      radius={'9999px'}
      style={style}
      onSubmit={onSubmit}>
      {id => (
        <>
          <StyledSearchInput id={id} placeholder={label} {...props} />
          <StyledSearchButton type="submit" tabIndex={-1}>
            <Icon glyph="search" size="1.25rem" />
          </StyledSearchButton>
        </>
      )}
    </Control>
  )
}

export default SearchForm
