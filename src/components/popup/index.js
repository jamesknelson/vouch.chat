import React, { useContext } from 'react'
import { useTransition } from 'react-spring/web.cjs'
import { Menu } from 'components/menu'
import {
  UnstyledPopupProvider,
  UnstyledPopupTrigger,
  UnstyledPopup,
} from 'controls/unstyledPopup'
import useTrigger from 'hooks/useTrigger'
import { PopupArrow, PopupBox } from './styles'

export { UnstyledPopupTrigger as PopupTrigger }

const modifiers = {
  flip: { enabled: false },
  preventOverflow: { enabled: false },
  hide: { enabled: false },
}

export const PopupContext = React.createContext({})

export function useClosePopup() {
  let { trigger } = useContext(PopupContext)
  return trigger.close
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

  let transitions = useTransition(open, null, {
    config: { tension: 415 },
    from: { opacity: 0, scale: 0.5, top: -10 },
    enter: { opacity: 1, scale: 1, top: 0 },
    leave: { opacity: 0, scale: 0.5, top: -10 },
  })

  return (
    <PopupContext.Provider value={{ transitions, trigger }}>
      <UnstyledPopupProvider trigger={trigger}>
        {children}
      </UnstyledPopupProvider>
    </PopupContext.Provider>
  )
}

export function Popup({ children, className, style, id, ...props }) {
  let { transitions } = useContext(PopupContext)

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
