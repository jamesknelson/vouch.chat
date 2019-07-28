import { rgba, lighten } from 'polished'
import React from 'react'
import { animated, useSpring, useTransition } from 'react-spring'
import { css } from 'styled-components/macro'
import { colors } from 'theme'
import Icon from 'components/icon'
import { useCurrentUser } from 'context'

export const VouchCountBadge = ({
  count,
  fontSize = '9px',
  size = '1rem',
  ...rest
}) => (
  <div
    {...rest}
    css={css`
      height: ${size};
      width: ${size};
    `}>
    <span
      css={css`
        background-color: ${rgba(lighten(0.88, colors.ink.black), 0.9)};
        box-shadow: 1px 1px 1px ${rgba(colors.ink.black, 0.15)} inset;
        border-radius: 999px;
        position: absolute;
        left: 2px;
        right: 2px;
        top: 2px;
        bottom: 2px;
      `}
    />
    <Icon
      glyph="stamp"
      size={size}
      css={css`
        color: ${colors.structure.bg};
        position: absolute;
        left: 0;
        transform: scale(1.25);
      `}
    />
    <Icon
      glyph="stamp"
      size={size}
      css={css`
        color: ${colors.ink.black};
        text-shadow: 2px 2px 8px ${rgba(colors.ink.black, 0.1)};
        position: absolute;
        left: 0;
      `}
    />
    <span
      css={css`
        position: absolute;
        left: 0;
        color: ${colors.ink.black};
        font-size: ${fontSize};
        font-weight: 600;
        width: 100%;
        line-height: 1rem;
        text-align: center;
        z-index: 2;
      `}>
      {count}
    </span>
  </div>
)

const AnimatedVouchCountBadge = animated(VouchCountBadge)

export const VouchCountBadgeWrapper = ({ children, count, size, ...props }) => {
  let transition = useTransition(count !== 0, null, {
    config: {
      tension: 215,
    },
    initial: { opacity: 1, scale: 1, bottom: -8 },
    from: { opacity: 0, scale: 0.5, bottom: 2 },
    enter: { opacity: 1, scale: 1, bottom: -8 },
    leave: { opacity: 0, scale: 0.5, bottom: -18 },
  })
  let countAnimationProps = useSpring({
    config: {
      tension: 100,
    },
    count,
  })

  return (
    <div
      {...props}
      css={css`
        position: relative;
      `}>
      {transition.map(
        ({ item, props: transitionProps, key }) =>
          item && (
            <AnimatedVouchCountBadge
              count={countAnimationProps.count.interpolate(count =>
                Math.round(count),
              )}
              css={css`
                position: absolute;
                right: -8px;
                z-index: 1;
              `}
              key={key}
              size={size}
              style={transitionProps}
            />
          ),
      )}
      {children}
    </div>
  )
}

export const CurrentUserVouchCountWrapper = ({ ...props }) => {
  let currentUser = useCurrentUser()
  return (
    <VouchCountBadgeWrapper
      count={currentUser ? currentUser.availableVouches : 0}
      {...props}
    />
  )
}
