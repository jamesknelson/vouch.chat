import React from 'react'
import Img from 'react-image'
import styled from 'styled-components'

const StyledAvatarImage = styled(Img)`
  border-radius: 9999px;
  max-height: 100%;
`

const StyledAvatarContainer = styled.span`
  display: inline-block;
  height: ${props => props.size};
  width: ${props => props.size};
`

export const UserAvatar = React.forwardRef(
  ({ className, hidden, style, ...props }, ref) => {
    return (
      <StyledAvatarImage
        {...props}
        container={children => {
          return (
            <StyledAvatarContainer
              className={className}
              hidden={hidden}
              size={props.size || '2.5rem'}
              style={style}
              ref={ref}>
              {children}
            </StyledAvatarContainer>
          )
        }}
        src="https://reactarmory.com/james.jpg"
      />
    )
  },
)
