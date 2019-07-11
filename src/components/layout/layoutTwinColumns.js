import React, { useContext, useRef } from 'react'
import { animated, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'

import ScrollContainer from 'components/scrollContainer'
import useMediaQuery from 'hooks/useMedia'
import { colors, dimensions, media, mediaQueries, shadows } from 'theme'
import LayoutContext from './layoutContext'

const columnStyles = css`
  padding-bottom: ${props => props.footerOverlayHeight || '0px'};

  ${({ entering, leaving, visibleOnPhone }) => media.phoneOnly`
    ${!entering &&
      !leaving &&
      !visibleOnPhone &&
      css`
        display: none;
      `}

    ${entering &&
      css`
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
        top: 0;
      `}

    ${leaving &&
      css`
        position: absolute;
        z-index: 5;
        width: 100%;
        height: 100%;
        top: 0;
      `}
  `}

  ${props =>
    props.withBackgroundOnTabletPlus &&
    media.tabletPlus`
      background-color: ${colors.structure.bg};
      border-style: solid;
      border-color: ${colors.structure.border};
      border-width: 0 1px;
      box-shadow: ${shadows.card()};
    `}
`

const StyledLayoutGrid = styled.div`
  ${media.tabletPlus`
    display: grid;
    grid-template-columns: minmax(320px, 400px) minmax(320px, 400px) 1fr;
    grid-template-areas: 'index content content';
    gap: 1rem;
    margin: 0 1rem;
  `}

  ${media.phoneOnly`
    position: relative;
  `}
`

// Don't animate the height, as height animations are nasty in performance
// terms, and it shouldn't result in a visual jump unless the scrollbar is
// visible at the time of the change.
const StyledAnimatedLayoutGridLeftColumn = animated(styled.div`
  ${columnStyles}
  ${media.tabletPlus`
    position: sticky;
    display: flex;
    flex-direction: column;
    top: 0;
    height: calc(100vh - ${props =>
      props.leaveSpaceForFooter ? dimensions.bar : '0px'});
    grid-area: index;
  `}
`)

const StyledColumnGridColumnContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
`

const StyledAnimatedLayoutGridRightColumn = animated(styled.div`
  ${columnStyles};
  ${media.tabletPlus`
    grid-area: content;
  `}
`)

export function LayoutTwinColumns({
  left,
  leftBackgroundOnTabletPlus = true,
  right,
  rightBackgroundOnTabletPlus = true,
  visibleColumnOnPhone,
  transitionKey,
}) {
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  let transitions = useTransition(
    {
      visibleColumnOnPhone,
      right,
    },
    transitionKey,
    {
      config: {
        tension: 320,
      },
      initial: null,
      from: {
        index: `translateX(-110%)`,
        content: `translateX(110%)`,
      },
      enter: {
        index: `translateX(0%)`,
        content: `translateX(0%)`,
      },
      leave: {
        index: `translateX(-110%)`,
        content: `translateX(110%)`,
      },
    },
  )

  let indexTransitions = transitions
  if (!isPhone) {
    indexTransitions = [
      {
        item: { visibleColumnOnPhone: 'left' },
        props: { x: { interpolate: fn => fn(0) } },
      },
    ]
  }

  let lastIndexStateRef = useRef('initial')

  return (
    <StyledLayoutGrid>
      {indexTransitions.map(({ item, props: { index }, key, state }) => {
        // When viewing a non-index page on mobile, initially
        // this will be `true`, at which point it'll do a leave
        // transition from initial. In this case, we don't actually
        // want to render the transition.
        let notInitial = lastIndexStateRef.current !== 'initial'
        lastIndexStateRef.current = state
        return (
          item.visibleColumnOnPhone === 'left' && (
            <LayoutLeftColumn
              key={'index_' + key}
              entering={state === 'enter' && notInitial}
              leaving={state === 'leave' && notInitial}
              visibleOnPhone={visibleColumnOnPhone === 'left'}
              withBackgroundOnTabletPlus={leftBackgroundOnTabletPlus}
              style={{
                transform: index,
              }}>
              {left}
            </LayoutLeftColumn>
          )
        )
      })}
      {transitions.map(
        ({
          item: { right, visibleColumnOnPhone },
          props: { content },
          key,
          state,
        }) =>
          (visibleColumnOnPhone === 'right' || !isPhone) && (
            <LayoutRightColumn
              key={key}
              entering={state === 'enter'}
              leaving={state === 'leave'}
              withBackgroundOnTabletPlus={rightBackgroundOnTabletPlus}
              visibleOnPhone={visibleColumnOnPhone === 'right'}
              style={{
                transform: content,
              }}>
              {right}
            </LayoutRightColumn>
          ),
      )}
    </StyledLayoutGrid>
  )
}

function LayoutLeftColumn({
  children,
  entering = false,
  leaving = false,
  visibleOnPhone,
  withBackgroundOnTabletPlus = true,
  ...rest
}) {
  let { footerOverlayHeight } = useContext(LayoutContext)
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  if (isPhone && !entering && !leaving && !visibleOnPhone) {
    return null
  }
  return (
    <StyledAnimatedLayoutGridLeftColumn
      {...rest}
      entering={entering}
      leaving={leaving}
      visibleOnPhone={visibleOnPhone}
      footerOverlayHeight={footerOverlayHeight}
      withBackgroundOnTabletPlus={withBackgroundOnTabletPlus}>
      <StyledColumnGridColumnContainer>
        {children}
      </StyledColumnGridColumnContainer>
    </StyledAnimatedLayoutGridLeftColumn>
  )
}

function LayoutRightColumn({
  children,
  entering = false,
  leaving = false,
  visibleOnPhone,
  withBackgroundOnTabletPlus = true,
  ...rest
}) {
  let { footerOverlayHeight } = useContext(LayoutContext)
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)

  if (isPhone && !entering && !leaving && !visibleOnPhone) {
    return null
  }

  return (
    <StyledAnimatedLayoutGridRightColumn
      {...rest}
      entering={entering}
      leaving={leaving}
      footerOverlayHeight={footerOverlayHeight}
      visibleOnPhone={visibleOnPhone}
      withBackgroundOnTabletPlus={withBackgroundOnTabletPlus}>
      <StyledColumnGridColumnContainer children={children} />
    </StyledAnimatedLayoutGridRightColumn>
  )
}

export const LayoutLeftColumnContentScroller = styled(ScrollContainer)`
  max-height: 100%;
  padding-bottom: 2rem;
`
