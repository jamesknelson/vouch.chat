import { rgba } from 'polished'
import React, { useState, useRef } from 'react'
import { animated, interpolate, useSpring } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import { colors } from 'theme'
import { UserAvatar } from 'components/avatar'
import Icon from 'components/icon'
import { Spinner } from 'components/loading'
import { CurrentUserVouchCountWrapper } from 'components/badge'
import { StyledNavbarLink } from './styles'

const StyledDisc = styled.div`
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
`
const Disc = props => {
  let lastUserRef = useRef(props.currentUser)
  if (props.currentUser) {
    lastUserRef.current = props.currentUser
  }
  let user = lastUserRef.current

  return (
    <StyledDisc style={{ transform: props.transform }}>
      {user && props.side === 'avatar' ? (
        <UserAvatar user={user} />
      ) : (
        <StyledLogoDisc>
          <Icon
            glyph="brand-letter"
            size="1.75rem"
            css={css`
              color: transparent;
              margin-top: 6px;
              text-shadow: 1px 1px 0px ${colors.structure.bg};
            `}
          />
        </StyledLogoDisc>
      )}
    </StyledDisc>
  )
}
const AnimatedDisc = animated(Disc)

const StyledLogoDisc = styled(StyledDisc)`
  background-color: ${colors.ink.black};
  color: ${colors.structure.wash};
  align-items: center;
  border-radius: 9999px;
  justify-content: center;
`

const StyledCutout = styled.div`
  align-items: center;
  background-color: ${colors.structure.wash};
  border: 1px solid ${colors.structure.border};
  border-radius: 9999px;
  box-shadow: 0 0 2px ${rgba(0, 0, 0, 0.05)} inset,
    0 0 2px 0px ${rgba(0, 0, 0, 0.1)} inset;
  display: flex;
  height: calc(2.5rem + 6px);
  justify-content: center;
  position: relative;
  width: calc(2.5rem + 6px);
`

const BrandAvatarFlipper = props => {
  let config = {
    mass: 1.5,
    tension: 180,
    friction: 16,
  }
  let [flickAngle, setFlickAngle] = useState(0)
  let transitionProps = useSpring({
    config,
    angle: props.currentUser ? Math.PI : 0,
  })
  let flickProps = useSpring({
    config,
    angle: flickAngle,
  })

  return (
    <StyledNavbarLink
      exact
      href={props.currentUser ? '/james' : '/'}
      focusRingSize="2.75rem"
      onTouchStart={() => {
        setFlickAngle(Math.PI / 6)
      }}
      onMouseDown={() => {
        setFlickAngle(Math.PI / 6)
      }}
      onTouchEnd={() => {
        setFlickAngle(0)
      }}
      onMouseUp={() => {
        setFlickAngle(0)
      }}
      css={css`
        align-items: center;
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
      `}>
      <Spinner
        active={props.currentUser === undefined}
        backgroundColor={colors.structure.bg}
        color={colors.ink.black}
        css={css`
          position: absolute;
          z-index: 0;
          height: 3rem;
          width: 3rem;
        `}
      />
      <StyledCutout>
        <CurrentUserVouchCountWrapper>
          <AnimatedDisc
            currentUser={props.currentUser}
            transform={interpolate(
              [transitionProps.angle, flickProps.angle],
              (transitionAngle, flickAngle) =>
                `rotateY(${transitionAngle + flickAngle}rad)`,
            )}
            side={interpolate(
              [transitionProps.angle, flickProps.angle],
              (transitionAngle, flickAngle) => {
                // Which side are we on?
                let front =
                  Math.round((transitionAngle + flickAngle) / Math.PI) % 2 === 1

                // Is there an avatar to show?
                let hasAvatar = !!(props.currentUser || transitionAngle > 0)

                return front && hasAvatar ? 'avatar' : 'brand'
              },
            )}
          />
        </CurrentUserVouchCountWrapper>
      </StyledCutout>
    </StyledNavbarLink>
  )
}

export default BrandAvatarFlipper
