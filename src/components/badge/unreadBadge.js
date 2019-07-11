import React from 'react'
import { animated, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import { colors } from 'theme'

const Pill = styled.div`
  display: flex;
  align-items: center;
  border-radius: 9999px;
  justify-content: center;
`

export const UnreadBadge = ({
  count,
  fontSize = '9px',
  size = '0.75rem',
  ...rest
}) => (
  <div {...rest}>
    <Pill
      css={css`
        background-color: ${colors.structure.bg};
        padding: 2px;
      `}>
      <Pill
        css={css`
          background-color: #4488dd;
          color: ${colors.structure.bg};
          font-weight: 600;
          line-height: ${fontSize};
          min-width: ${size};
          min-height: ${size};
          font-size: ${fontSize};
          padding: 1px 2px;
          text-align: center;
          z-index: 2;
        `}>
        {count || ''}
      </Pill>
    </Pill>
  </div>
)

const AnimatedUnreadBadge = animated(UnreadBadge)

export const UnreadBadgeWrapper = ({ children, count = 0, size, ...props }) => {
  let transition = useTransition(count !== 0, null, {
    config: {
      tension: 415,
    },
    initial: {
      opacity: count !== 0 ? 1 : 0,
      scale: count !== 0 ? 1 : 0.5,
      bottom: count !== 0 ? -7 : 7,
    },
    from: { opacity: 0, scale: 0.5, bottom: 5 },
    enter: { opacity: 1, scale: 1, bottom: -5 },
    leave: { opacity: 0, scale: 0.5, bottom: -15 },
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
            <AnimatedUnreadBadge
              count={count}
              css={css`
                position: absolute;
                left: -5px;
                top: -5px;
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
