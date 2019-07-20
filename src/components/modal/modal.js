import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { animated, useTransition } from 'react-spring'
import styled, { css } from 'styled-components/macro'

import Card from 'components/card'
import useNoBodyScroll from 'hooks/useNoBodyScroll'
import { colors, media } from 'theme'
import addDefaultRemUnits from 'utils/addDefaultRemUnits'
import { IconButton } from 'components/button'

const alignments = {
  center: 'center',
  top: 'flex-start',
}

export const ModalGutter = styled.div`
  padding: 0rem 1rem 1rem;
`

const StyledAnimatedModalBackdrop = styled(animated.div)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  z-index: 999999;
`

const StyledSpacer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${props => alignments[props.align]};
  justify-content: center;
  padding: 4rem 2rem;
  width: 100%;
  min-height: 100%;
`

const StyledAnimatedCard = styled(animated(Card))`
  flex-grow: 1;
  flex-shrink: 1;

  ${props =>
    props.width &&
    media.tabletPlus &&
    css`
      max-width: ${addDefaultRemUnits(props.width)};
    `}
`

// The id of the element to apply aria-hidden to while the modal is open.
Modal.rootId = 'root'

function Modal({
  align = 'center',
  children,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  onClose,
  open = false,
  title,
  width = '480px',
  ...rest
}) {
  let backdropRef = useRef()
  let transitions = useTransition(open, null, {
    config: {
      tension: 400,
    },
    from: { opacity: 0, transform: 'scale(1.5)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.5)' },
  })

  // Remove the body scrollbar while the modal is open
  useNoBodyScroll(open)

  // Handle escape key
  useEffect(() => {
    if (closeOnEscape) {
      let handleKeyDown = event => {
        if (event.key === 'Escape' && onClose) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown, false)

      return () => {
        document.removeEventListener('keydown', handleKeyDown, false)
      }
    }
  }, [closeOnEscape, onClose])

  // Add aria-hidden to the rest of the application content
  useEffect(() => {
    let rootNode = document.getElementById(Modal.rootId)
    if (rootNode) {
      // Timeout to ensure this happens *after* focus has moved
      setTimeout(() => {
        rootNode.setAttribute('aria-hidden', 'true')
      }, 0)
      return () => {
        rootNode.setAttribute('aria-hidden', 'false')
      }
    }
  }, [])

  // Modals can't be server-rendered.
  if (typeof window === 'undefined') {
    return null
  }

  let handleBackdropClick = event => {
    if (
      closeOnBackdropClick &&
      event.target === backdropRef.current &&
      onClose
    ) {
      onClose()
    }
  }

  return createPortal(
    transitions.map(
      ({ item, props, key }) =>
        item && (
          <StyledAnimatedModalBackdrop
            key={key}
            style={{ opacity: props.opacity }}>
            <StyledSpacer
              onClick={handleBackdropClick}
              ref={backdropRef}
              align={align}>
              <StyledAnimatedCard raised style={props} width={width} {...rest}>
                <header
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid ${colors.structure.border};
                  `}>
                  <h2
                    css={css`
                      font-size: 1.1rem;
                      font-weight: 500;
                      line-height: 1.1rem;
                      padding: 1rem;
                    `}>
                    {title}
                  </h2>
                  <IconButton
                    color={colors.gray}
                    disabled={!onClose}
                    autoFocus
                    glyph="cross2"
                    size={1}
                    onClick={onClose}
                  />
                </header>
                {children}
              </StyledAnimatedCard>
            </StyledSpacer>
          </StyledAnimatedModalBackdrop>
        ),
    ),
    document.body,
  )
}

export default Modal
