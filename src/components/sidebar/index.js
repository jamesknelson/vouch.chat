import React from 'react'
import { animated, useTransition } from 'react-spring'
import styled from 'styled-components/macro'
import Card from 'components/card'

const StyledSidebarCard = styled(animated(Card))`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 70%;
  max-width: 250px;
  z-index: 99;
`

const StyledSidebarBackdrop = styled(animated.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
`

// Prevents events from passing through to the sidebar while it is still
// being animated. This is important on iPhone where a press on the trigger
// can cause a click on a newly revealed sidebar link immediately afterwards.
const StyledSidebarMask = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
`

const Sidebar = React.forwardRef(
  ({ children, open, side = 'right', ...rest }, ref) => {
    let negate = side === 'left' ? '-' : ''
    let transitions = useTransition(open, null, {
      config: { tension: 300, mass: 0.5 },
      from: { opacity: 0, transform: `translateX(${negate}100%)` },
      enter: { opacity: 1, transform: 'translateX(0)' },
      leave: { opacity: 0, transform: `translateX(${negate}100%)` },
    })

    return transitions.map(
      ({ item, props: { opacity, transform }, key, state }) =>
        item && (
          <React.Fragment key={key}>
            <StyledSidebarBackdrop
              style={{
                opacity,
              }}
            />
            <StyledSidebarCard
              radius={0}
              raised
              ref={ref}
              style={{
                transform,
              }}
              {...rest}>
              {children}
              {state !== 'update' && <StyledSidebarMask />}
            </StyledSidebarCard>
          </React.Fragment>
        ),
    )
  },
)

export default Sidebar
