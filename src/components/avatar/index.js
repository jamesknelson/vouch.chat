import React from 'react'
import Img from 'react-image'
import styled from 'styled-components/macro'
import { useCurrentUser } from 'context'
import { colors, focusRing } from 'theme'
import anonymous from './anonymous.svg'

const StyledAvatarImage = styled(Img)`
  border-radius: 9999px;
  max-height: 100%;
  max-width: 100%;
`

const StyledLoader = styled.span`
  display: block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  background-color: ${colors.structure.border};
`

const StyledAvatarContainer = styled.span`
  align-items: center;
  display: flex;
  justify-content: center;
  height: ${props => props.size};
  width: ${props => props.size};
  position: relative;
  user-select: none;

  ${focusRing('::before', { radius: '9999px' })}
`

export const UserAvatar = React.forwardRef(
  ({ className, hidden, style, tabIndex, user, ...props }, ref) => {
    return (
      <StyledAvatarImage
        {...props}
        loader={<StyledLoader />}
        container={children => {
          return (
            <StyledAvatarContainer
              className={className}
              hidden={hidden}
              size={props.size || '2.5rem'}
              style={style}
              tabIndex={tabIndex}
              ref={ref}>
              {children}
            </StyledAvatarContainer>
          )
        }}
        src={user.photoURL || anonymous}
      />
    )
  },
)
