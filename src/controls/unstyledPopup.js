import React, { useCallback, useContext } from 'react'
import { Manager, Reference, Popper } from 'react-popper'

const PopupContext = React.createContext({})

export function UnstyledPopupProvider({ trigger, children, ...popperProps }) {
  return (
    <PopupContext.Provider value={{ trigger }}>
      <Manager {...popperProps}>{children}</Manager>
    </PopupContext.Provider>
  )
}

export function UnstyledPopupTrigger(props) {
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

export function UnstyledPopup({ children, ...popperProps }) {
  return (
    <Popper {...popperProps}>
      {({ ref, ...renderProps }) => (
        <InnerPopup
          children={children}
          renderProps={renderProps}
          popperRef={ref}
        />
      )}
    </Popper>
  )
}

function InnerPopup({ popperRef, children, renderProps }) {
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
