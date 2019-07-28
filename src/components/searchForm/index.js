import React, { useCallback, useRef } from 'react'
import { rgba } from 'polished'
import styled from 'styled-components/macro'
import { Control } from 'components/control'
import Icon from 'components/icon'
import { colors, easings, media } from 'theme'

const StyledSearchInput = styled.input`
  width: 0;
  background-color: transparent;
  color: ${colors.text.default};
  flex-grow: 1;
  flex-shrink: 1;
  font-size: 0.9rem;
  padding: 0.75rem 0 0.75rem 0.75rem;
  border-radius: 9999px;

  ::placeholder {
    color: ${colors.text.placeholder};
    font-weight: 400;
  }
`

const StyledSearchButton = styled.button`
  background-color: transparent;
  color: ${({ variant = 'default' }) => colors.control.icon[variant]};
  cursor: pointer;
  order: -1;
  border-radius: 1rem;
  margin-left: 0.75rem;
  ${media.tabletPlus`
    margin-right: 0.5rem;
  `}

  transition: text-shadow 200ms ${easings.easeOut},
    color 200ms ${easings.easeOut};

  :active,
  ${StyledSearchInput}:focus ~ & {
    color: ${colors.focus.default};
    text-shadow: 0 0 3px ${rgba(colors.focus.default, 0.5)};
  }
`

const StyledClearButton = styled.button`
  background-color: transparent;
  color: ${colors.control.icon.empty};
  cursor: pointer;
  border-radius: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.75rem;

  transition: text-shadow 200ms ${easings.easeOut},
    color 200ms ${easings.easeOut};

  :active {
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
  onClear,
  onSubmit,
  value,
  ...props
}) {
  let inputRef = useRef()

  let handleKeyDown = useCallback(
    event => {
      if (event.key === 'Escape') {
        onChange('')
      }
    },
    [onChange],
  )

  let handleChange = useCallback(
    event => {
      onChange(event.target.value)
    },
    [onChange],
  )

  let handleClear = useCallback(() => {
    onClear()

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [onClear])

  let handleSubmit = useCallback(
    event => {
      event.preventDefault()
      onSubmit()
    },
    [onSubmit],
  )

  return (
    <Control
      as="form"
      id={id}
      label={label}
      className={className}
      radius="9999px"
      style={style}
      onSubmit={handleSubmit}>
      {inputProps => (
        <>
          <StyledSearchInput
            name="q"
            ref={inputRef}
            placeholder={label}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            style={style}
            value={value}
            {...props}
            {...inputProps}
          />
          <StyledSearchButton
            type="submit"
            tabIndex={-1}
            variant={props.value ? 'default' : 'empty'}>
            <Icon glyph="search" size="1.25rem" />
          </StyledSearchButton>
          {value && (
            <StyledClearButton
              type="button"
              tabIndex={-1}
              onClick={handleClear}>
              <Icon glyph="x" size="1.25rem" />
            </StyledClearButton>
          )}
        </>
      )}
    </Control>
  )
}

export default SearchForm
