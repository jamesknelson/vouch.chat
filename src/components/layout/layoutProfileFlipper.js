import React, { useState, useRef } from 'react'
import { animated, interpolate, useSpring } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import { colors } from 'theme'
import { UserAvatar } from 'components/avatar'
import { Spinner } from 'components/loading'
import { CurrentUserVouchCountWrapper } from 'components/badge'
import { StyledNavLink } from './layoutNavItems'
import logo from 'media/anonymous.svg'
import { useLoadingRoute } from 'react-navi'

const StyledDisc = styled.div`
  display: flex;
  ${props => css`
    height: ${props.size};
    width: ${props.size};
  `}
`
const Disc = props => {
  let lastUserRef = useRef(props.currentUser)
  if (props.currentUser) {
    lastUserRef.current = props.currentUser
  }
  let user = lastUserRef.current

  return (
    <StyledDisc size={props.size} style={{ transform: props.transform }}>
      {user && props.side === 'avatar' ? (
        <UserAvatar user={user} size={props.size} />
      ) : (
        <img
          alt="Logo"
          src={logo}
          css={css`
            border-radius: 9999px;
            width: ${props.size};
            height: ${props.size};
          `}
        />
      )}
    </StyledDisc>
  )
}
const AnimatedDisc = animated(Disc)

const StyledCutout = styled.div`
  align-items: center;
  background-color: ${colors.structure.wash};
  border: 1px solid ${colors.structure.border};
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  position: relative;
  ${props => css`
    height: calc(${props.size} + 6px);
    width: calc(${props.size} + 6px);
  `}
`

const ProfileFlipper = React.forwardRef(
  (
    { currentUser, sizeRem = 3, badgeSizeRem = 1.25, className, style },
    ref,
  ) => {
    let config = {
      mass: 1.5,
      tension: 180,
      friction: 16,
    }
    let [flickAngle, setFlickAngle] = useState(0)
    let transitionProps = useSpring({
      config,
      angle: currentUser ? Math.PI : 0,
    })
    let flickProps = useSpring({
      config,
      angle: flickAngle,
    })
    let loadingRoute = useLoadingRoute()

    let isLoading = !!loadingRoute || currentUser === undefined

    return (
      <StyledNavLink
        exact
        href={currentUser ? '/james' : '/login'}
        focusRingSize={`${sizeRem - 0.25}rem`}
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
        ref={ref}
        className={className}
        style={style}
        css={css`
          align-items: center;
          display: flex;
          justify-content: center;
          position: relative;
          width: 100%;
        `}>
        <Spinner
          active={isLoading}
          backgroundColor={colors.structure.bg}
          color={colors.ink.black}
          css={css`
            position: absolute;
            z-index: 0;
            height: ${sizeRem}rem;
            width: ${sizeRem}rem;
          `}
        />
        <StyledCutout size={sizeRem - 0.5 + 'rem'}>
          <CurrentUserVouchCountWrapper badgeSizeRem={badgeSizeRem}>
            <AnimatedDisc
              currentUser={currentUser}
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
                    Math.round((transitionAngle + flickAngle) / Math.PI) % 2 ===
                    1

                  // Is there an avatar to show?
                  let hasAvatar = !!(currentUser || transitionAngle > 0)

                  return front && hasAvatar ? 'avatar' : 'brand'
                },
              )}
              size={sizeRem - 0.5 + 'rem'}
            />
          </CurrentUserVouchCountWrapper>
        </StyledCutout>
      </StyledNavLink>
    )
  },
)

export default ProfileFlipper
