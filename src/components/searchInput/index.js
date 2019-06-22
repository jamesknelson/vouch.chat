import React, { useRef } from 'react'
import { rgba } from 'polished'
import styled from 'styled-components/macro'
import Icon from 'components/icon'
import { colors, easings, shadows, srOnly } from 'theme'
import createInputId from 'utils/createInputId'

const StyledSearchWrapper = styled.form`
  background-color: ${colors.control.bg};
  border-radius: 1.25rem;
  border: 1px solid ${colors.control.border};
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.02) inset;
  position: relative;
  display: flex;
  ${props => (props.flex ? 'flex: ' + props.flex : '')};
`

const StyledSearchBorders = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  border-radius: 1.25rem;
  z-index: 1;
  transition: box-shadow 200ms ${easings.easeOut};
`

const StyledSearchButton = styled.button`
  color: ${colors.control.icon};
  cursor: pointer;
  border-radius: 1rem;
  z-index: 3;
  margin-right: 0.75rem;
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

  transition: box-shadow 200ms ${easings.easeOut},
    border-color 200ms ${easings.easeOut};

  position: relative;
  z-index: 2;
  :focus ~ ${StyledSearchBorders} {
    border-color: ${colors.focus.border};
    box-shadow: ${shadows.focus()},
      1px 1px 2px 1px ${rgba(colors.ink.black, 0.02)} inset;
  }
  :focus ~ ${StyledSearchButton} {
    color: ${colors.focus.default};
    text-shadow: 0 0 3px ${rgba(colors.focus.default, 0.5)};
  }
`

function SearchInput({ as, id, label, className, style, hidden, ...props }) {
  let { current: inputId } = useRef(id || createInputId())
  return (
    <StyledSearchWrapper style={style} className={className} hidden={hidden}>
      {label && (
        <label htmlFor={inputId} css={srOnly}>
          {label}
        </label>
      )}
      <StyledSearchInput id={id} placeholder={label} {...props} />
      <StyledSearchBorders />
      <StyledSearchButton type="submit" tabIndex={-1}>
        <Icon glyph="search" size="1.25rem" />
      </StyledSearchButton>
    </StyledSearchWrapper>
  )
}

export default SearchInput
