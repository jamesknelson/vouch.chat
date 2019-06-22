import { rgba } from 'polished'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-navi'
import { Manager, Reference, Popper } from 'react-popper'
import { animated, interpolate, useTransition } from 'react-spring/web.cjs'
import styled, { css } from 'styled-components/macro'
import Tippy from '@tippy.js/react'
import { colors, dimensions, focusRing, shadows } from 'theme'
import { UserAvatar } from 'components/avatar'
import { PenButtonLink } from 'components/button'
import Card from 'components/card'
import Icon from 'components/icon'
import SearchInput from 'components/searchInput'
import { easings } from '../../theme'

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
`

const Header = styled.header`
  align-items: center;
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.border};
  box-shadow: ${shadows.card()};
  display: flex;
  height: ${dimensions.bar};
  justify-content: space-between;
  left: ${dimensions.bar};
  padding: 1rem;
  position: fixed;
  top: 0;
  width: calc(100% - ${dimensions.bar});
`

const Body = styled.div`
  height: 100%;
  min-height: 100%;
`

const Sidebar = styled.nav`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.card()};
  border-right: 1px solid ${colors.structure.border};
  height: calc(100% - ${dimensions.bar});
  padding-top: 0.75rem;
  position: fixed;
  top: ${dimensions.bar};
  width: ${dimensions.bar};
`

const Main = styled.main`
  padding-left: ${dimensions.bar};
  padding-top: ${dimensions.bar};
`

const HomeLink = styled(Link)`
  align-items: center;
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.divider};
  border-right: 1px solid ${colors.structure.divider};
  color: ${colors.ink.black};
  display: flex;
  height: ${dimensions.bar};
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: ${dimensions.bar};
  z-index: 2;

  ${focusRing('::before', { padding: '-0.6rem' })}
`

const StyledNavLink = styled(Link)`
  align-items: center;
  color: ${colors.ink.black};
  display: flex;
  justify-content: center;
  margin: 0.25rem 0;
  padding: 0.25rem 0;
  width: ${dimensions.bar};
  position: relative;

  text-shadow: 0 0 0.75rem rgba(84, 96, 108, 0);

  transition: text-shadow 200ms ${easings.easeOut};

  ::after {
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    right: 0px;
    background-color: ${rgba(colors.ink.black, 0)};
    box-shadow: 0 0 0 0 ${rgba(colors.ink.black, 0)};
    transition: background-color 200ms ${easings.easeOut},
      box-shadow 200ms ${easings.easeOut};
  }

  &.NavLink-active {
    text-shadow: 0 0 0.75rem rgba(84, 96, 108, 0.75);

    ::after {
      background-color: ${rgba(colors.ink.black, 0.15)};
      box-shadow: 0 0 2px 1px ${rgba(colors.ink.black, 0.08)};
    }
  }

  :focus::after {
    background-color: ${colors.focus.default};
    box-shadow: ${shadows.focusSoft()};
    width: 2px;
  }

  &:focus {
    text-shadow: 0 0 0.75rem ${rgba(colors.focus.default, 0.8)};
  }
`

const NavLink = ({ title, ...props }) => (
  <Tippy
    placement="right"
    touch={false}
    arrow={true}
    arrowType="round"
    content={
      <span style={{ fontSize: '14px', fontWeight: '600' }}>{title}</span>
    }>
    <StyledNavLink {...props} activeClassName="NavLink-active" />
  </Tippy>
)

const AvailableStampsIndicator = ({ highlight, count, ...props }) => (
  <Link
    href="/plans"
    css={css`
      color: ${colors.ink.black};
      display: flex;
      align-items: center;
      margin: 0 1rem;
      position: relative;
      ${focusRing('::after', { padding: '2px 0.5rem' })}
    `}>
    <Icon glyph="vouch" size="1rem" />
    <span
      css={css`
        font-size: 1rem;
        font-weight: 800;
        margin-left: 0.25rem;
      `}>
      {count}
    </span>
  </Link>
)

const modifiers = {
  flip: { enabled: false },
  preventOverflow: { enabled: false },
  hide: { enabled: false },
}

export const Arrow = styled('div')`
  position: absolute;
  width: 0;
  height: 0;

  &::before,
  &::after {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    position: absolute;
  }
  &::before {
    border-width: 8px;
  }
  &::after {
    border-width: 7px;
    margin-left: 1px;
    margin-top: 2px;
  }

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -1rem;
    width: 0.5rem;
    height: 0.5rem;
    &::before {
      border-color: transparent transparent ${colors.structure.border}
        transparent;
      z-index: 1;
    }
    &::after {
      border-color: transparent transparent ${colors.structure.bg} transparent;
      z-index: 2;
    }
  }
  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -0.9em;
    width: 1em;
    height: 0.5em;
    &::before {
      border-width: 0.5em 1em 0 1em;
      border-color: #232323 transparent transparent transparent;
    }
  }
  &[data-placement*='right'] {
    left: 0;
    margin-left: -0.9em;
    height: 3em;
    width: 1em;
    &::before {
      border-width: 1.5em 1em 1.5em 0;
      border-color: transparent #232323 transparent transparent;
    }
  }
  &[data-placement*='left'] {
    right: 0;
    margin-right: -0.9em;
    height: 3em;
    width: 1em;
    &::before {
      border-width: 1.5em 0 1.5em 1em;
      border-color: transparent transparent transparent#232323;
    }
  }
`

const AnimatedCard = animated(Card)

const StyledPopperBox = styled(AnimatedCard)`
  display: flex;
  box-shadow: 0 0 6px 1px ${rgba(0, 0, 0, 0.05)},
    0 0 8px 1px ${rgba(0, 0, 0, 0.02)};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 6em;
  height: 6em;
  margin: 0.5em 0;
  padding: 0.5em;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 3;

  padding: 1em;
  width: 10em;
  transform-origin: top center;
`

const PopperBox = ({
  animationProps: { opacity, scale, top: topOffset },
  left,
  top,
  innerRef,
  ...props
}) =>
  console.log(left, top) || (
    <StyledPopperBox
      ref={innerRef}
      {...props}
      style={{
        opacity: opacity,
        transform: interpolate(
          [scale, topOffset],
          (scale, topOffset) =>
            `translate3d(${left}px, ${top + topOffset}px, 0) scale(${scale})`,
        ),
        position: props.position,
      }}
    />
  )

const UserDropdown = () => {
  let [open, setOpen] = useState(false)
  let toggle = () => {
    setOpen(!open)
  }

  let transitions = useTransition(open, null, {
    config: { tension: 415 },
    from: { opacity: 0, scale: 0.5, top: -10 },
    enter: { opacity: 1, scale: 1, top: 0 },
    leave: { opacity: 0, scale: 0.5, top: -10 },
  })

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <UserAvatar
            ref={ref}
            css={css`
              cursor: pointer;
              margin-right: 1rem;
            `}
            onClick={toggle}
          />
        )}
      </Reference>
      {transitions.map(
        ({ item, props: animationProps, key }) =>
          item && (
            <Popper
              placement="bottom-end"
              key={key}
              modifiers={{
                ...modifiers,
                // We disable the built-in gpuAcceleration so that
                // Popper.js will return us easy to interpolate values
                // (top, left instead of transform: translate3d)
                // We'll then use these values to generate the needed
                // css tranform values blended with the react-spring values
                computeStyle: { gpuAcceleration: false },
              }}>
              {({
                ref,
                style: { top, left, position },
                placement,
                arrowProps,
              }) =>
                createPortal(
                  <PopperBox
                    innerRef={ref}
                    animationProps={animationProps}
                    position={position}
                    top={top}
                    left={left}>
                    <a
                      href="https://github.com/drcmda/react-spring"
                      target="_blank"
                      rel="noopener noreferrer">
                      react-spring
                    </a>
                    animated
                    <Arrow
                      ref={arrowProps.ref}
                      data-placement={placement}
                      style={arrowProps.style}
                    />
                  </PopperBox>,
                  document.body,
                )
              }
            </Popper>
          ),
      )}
    </Manager>
  )
}

const Layout = props => (
  <Wrapper>
    <HomeLink href="/">
      <Icon glyph="brand" size="2.5rem" />
    </HomeLink>
    <Header>
      <SearchInput
        label="Search"
        css={css`
          max-width: 400px;
          flex: 1;
        `}
      />
      <div
        css={css`
          flex: 1;
        `}
      />
      <AvailableStampsIndicator count={2} />
      <UserDropdown />
      <PenButtonLink remaining={1} href="/pen">
        Pen
      </PenButtonLink>
    </Header>
    <Body>
      <Sidebar>
        <NavLink href="/notifications" title="Notifications">
          <Icon glyph="bell" size="1.75rem" />
        </NavLink>
        <NavLink href="/messages" title="Messages">
          <Icon glyph="envelope" size="1.75rem" />
        </NavLink>
        <NavLink href="/watch" title="Watch">
          <Icon glyph="glasses" size="1.75rem" />
        </NavLink>
      </Sidebar>
      <Main>{props.children}</Main>
    </Body>
  </Wrapper>
)

export default Layout
