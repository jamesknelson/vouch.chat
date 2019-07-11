import React from 'react'
import styled from 'styled-components/macro'
import { colors } from 'theme'
import defaultProfilePicture from 'media/defaultProfilePicture.svg'
import hash from 'media/hash.svg'

const StyledAvatarImage = styled.img`
  border-radius: 9999px;
  max-height: 100%;
  max-width: 100%;
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
`

export const Avatar = React.forwardRef(
  ({ className, hidden, style, tabIndex, photoURL, size, ...props }, ref) => (
    <StyledAvatarContainer
      className={className}
      hidden={hidden}
      size={size || '2.5rem'}
      style={style}
      tabIndex={tabIndex}
      ref={ref}>
      <StyledAvatarImage {...props} src={photoURL} />
    </StyledAvatarContainer>
  ),
)

export const UserAvatar = React.forwardRef(({ user, ...props }, ref) => (
  <Avatar
    photoURL={(user && user.photoURL) || defaultProfilePicture}
    {...props}
  />
))

export const TagAvatar = React.forwardRef(({ tag, ...props }, ref) => (
  <Avatar photoURL={(tag && tag.photoURL) || hash} {...props} />
))
