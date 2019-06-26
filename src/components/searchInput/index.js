import React from 'react'
import { rgba } from 'polished'
import styled, { css } from 'styled-components/macro'
import Icon from 'components/icon'
import { colors, easings, focusRing, srOnly } from 'theme'
import useControlId from 'hooks/useControlId'

const StyledSearchWrapper = styled.form`
  background-color: ${colors.control.bg.default};
  border-radius: 1.25rem;
  box-shadow: 0 0 0 1px ${colors.control.border.default} inset,
    3px 3px 2px 1px rgba(0, 0, 0, 0.02) inset;
  position: relative;
  display: flex;
  ${props => (props.flex ? 'flex: ' + props.flex : '')};
`

// This can be referenced when the input is focused by using the CSS `~`
// sibling selector, allowing for a focus ring to be added that is
// positioned with the group, as opposed to the individual input.
// However, it is stacked underneath the control itself to avoid blocking
// input.
const StyledSearchFocusTarget = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 1;
`

const StyledSearchButton = styled.button`
  background-color: transparent;
  color: ${colors.control.icon.default};
  cursor: pointer;
  border-radius: 1rem;
  z-index: 3;
  margin-right: 0.75rem;
  transition: text-shadow 200ms ${easings.easeOut},
    color 200ms ${easings.easeOut};
`

const StyledSearchInput = styled.input`
  background-color: transparent;
  border-color: transparent;
  border-radius: 1.25rem;
  height: 2.5rem;
  flex-basis: 100%;
  flex-shrink: 1;
  flex-grow: 1;
  font-size: 0.9rem;
  margin: 0;
  padding: 0.75rem 1rem;
  width: 100%;
  display: block;

  &::placeholder,
  &::-webkit-input-placeholder,
  &:-moz-placeholder,
  &:-ms-input-placeholder {
    color: ${colors.text.placeholder};
  }

  position: relative;
  z-index: 2;

  ${focusRing(css` ~ ${StyledSearchFocusTarget}`, { radius: '9999px' })}

  :focus ~ ${StyledSearchButton} {
    color: ${colors.focus.default};
    text-shadow: 0 0 3px ${rgba(colors.focus.default, 0.5)};
  }
`

function SearchInput({ as, id, label, className, style, hidden, ...props }) {
  let inputId = useControlId(id)
  return (
    <StyledSearchWrapper style={style} className={className} hidden={hidden}>
      {label && (
        <label htmlFor={inputId} css={srOnly}>
          {label}
        </label>
      )}
      <StyledSearchInput id={inputId} placeholder={label} {...props} />
      <StyledSearchFocusTarget />
      <StyledSearchButton type="submit" tabIndex={-1}>
        <Icon glyph="search" size="1.25rem" />
      </StyledSearchButton>
    </StyledSearchWrapper>
  )
}

export default SearchInput
