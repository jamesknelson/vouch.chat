import React, { useCallback, useContext } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import { useTransition } from 'react-spring/web.cjs'
import { Menu } from 'components/menu'
import useTrigger from 'popup-trigger/hook.cjs'
import { PopupArrow, PopupBox } from './popupStyles'

const modifiers = {
  flip: { enabled: false },
  preventOverflow: { enabled: false },
  hide: { enabled: false },
}

export const PopupContext = React.createContext({
  open: false,
  trigger: undefined,
})

export function useClosePopup() {
  let { trigger } = useContext(PopupContext)
  return trigger.close
}

export function PopupTrigger(props) {
  return (
    <Reference>
      {({ ref }) => <InnerPopperTrigger popperRef={ref} {...props} />}
    </Reference>
  )
}

function InnerPopperTrigger({ children, popperRef }) {
  let { trigger } = useContext(PopupContext)
  let triggerRef = trigger && trigger.ref
  let ref = useCallback(
    node => {
      popperRef(node)
      if (triggerRef) {
        triggerRef(node)
      }
    },
    [popperRef, triggerRef],
  )

  return children(ref)
}

function UnstyledPopup({ children, ...popperProps }) {
  return (
    <Popper {...popperProps}>
      {({ ref, ...renderProps }) => (
        <InnerUnstyledPopup
          children={children}
          renderProps={renderProps}
          popperRef={ref}
        />
      )}
    </Popper>
  )
}

function InnerUnstyledPopup({ popperRef, children, renderProps }) {
  let { trigger } = useContext(PopupContext)
  let containerRef = trigger && trigger.popupRef
  let ref = useCallback(
    node => {
      popperRef(node)
      if (containerRef) {
        containerRef(node)
      }
    },
    [popperRef, containerRef],
  )
  return children({
    ...renderProps,
    ref,
  })
}

export const PopupProvider = ({
  triggerOnFocus,
  triggerOnHover,
  triggerOnSelect,
  closeOnEscape,
  delayIn,
  delayOut,

  open,

  children,

  ...popperProps
}) => {
  let trigger = useTrigger({
    triggerOnFocus,
    triggerOnHover,
    triggerOnSelect,
    closeOnEscape,
    delayIn,
    delayOut,
  })

  if (open === undefined) {
    open = trigger.active
  }

  return (
    <PopupContext.Provider value={{ open, trigger }}>
      <Manager {...popperProps}>{children}</Manager>
    </PopupContext.Provider>
  )
}

export function Popup({ children, className, style, id, ...props }) {
  let { open } = useContext(PopupContext)
  let transitions = useTransition(open, null, {
    config: { tension: 415 },
    from: { opacity: 0, scale: 0.5, top: -10 },
    enter: { opacity: 1, scale: 1, top: 0 },
    leave: { opacity: 0, scale: 0.5, top: -10 },
  })

  return transitions.map(
    ({ item, props: transitionProps, key }) =>
      item && (
        <UnstyledPopup
          {...props}
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
          {({ ref, style: { top, left, position }, placement, arrowProps }) => (
            <PopupBox
              className={className}
              style={style}
              id={id}
              ref={ref}
              data-placement={placement}
              transitionProps={transitionProps}
              position={position}
              top={top}
              left={left}>
              {children}
              <PopupArrow
                ref={arrowProps.ref}
                data-placement={placement}
                style={arrowProps.style}
              />
            </PopupBox>
          )}
        </UnstyledPopup>
      ),
  )
}

export function PopupMenu({ children, ...rest }) {
  let close = useClosePopup()
  return (
    <Popup {...rest}>
      <Menu onDidSelect={close}>{children}</Menu>
    </Popup>
  )
}
