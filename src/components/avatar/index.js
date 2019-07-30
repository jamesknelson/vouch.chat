import React from 'react'
import styled, { css } from 'styled-components/macro'
import { space } from 'styled-system'

import { Spinner } from 'components/loading'
import defaultProfilePicture from 'media/defaultProfilePicture.svg'
import hash from 'media/hash.svg'
import { colors, focusRing } from 'theme'
import addDefaultRemUnits from 'utils/addDefaultRemUnits'

const StyledAvatarImage = styled.img`
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  position: relative;

  ${props =>
    props.busy &&
    css`
      opacity: 0.5;
    `}
`

const StyledAvatarContainer = styled.span`
  background-color: ${colors.structure.wash};
  align-items: center;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  height: ${props => props.size};
  width: ${props => props.size};
  position: relative;
  user-select: none;

  ${space};

  ${props =>
    props.tabIndex !== undefined && focusRing('::after', { radius: '9999px' })}
`

export const Avatar = React.forwardRef(
  (
    {
      backgroundColor = colors.structure.bg,
      busy = false,
      className,
      hidden,
      style,
      tabIndex,
      photoURL,
      size,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      ...props
    },
    ref,
  ) => {
    size = addDefaultRemUnits(size || 2.5)
    return (
      <StyledAvatarContainer
        className={className}
        hidden={hidden}
        size={size}
        style={style}
        tabIndex={tabIndex}
        {...{
          margin,
          marginX,
          marginY,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
        }}
        ref={ref}>
        {busy && (
          <Spinner
            active={busy}
            backgroundColor={backgroundColor}
            color={colors.ink.black}
            css={css`
              position: absolute;
              z-index: 0;
              left: -0.05rem;
              top: -0.05rem;
              height: calc(${size} + 0.1rem);
              width: calc(${size} + 0.1rem);
            `}
          />
        )}
        <StyledAvatarImage {...props} busy={busy} src={photoURL} />
      </StyledAvatarContainer>
    )
  },
)

export const UserAvatar = React.forwardRef(({ user, ...props }, ref) => (
  <Avatar
    ref={ref}
    photoURL={(user && user.photoURL) || defaultProfilePicture}
    {...props}
  />
))

export const TagAvatar = React.forwardRef(({ tag, ...props }, ref) => (
  <Avatar ref={ref} photoURL={(tag && tag.photoURL) || hash} {...props} />
))
