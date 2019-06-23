import React, { useContext } from 'react'
import { Link } from 'react-navi'
import { useTransition } from 'react-spring/web.cjs'
import {
  UnstyledPopupProvider,
  UnstyledPopupTrigger,
  UnstyledPopup,
} from 'controls/unstyledPopup'
import useTrigger from 'hooks/useTrigger'
import { PopupArrow, PopupBox, StyledPopupMenuItem } from './styles'

export { PopupMenuDivider } from './styles'
export { UnstyledPopupTrigger as PopupTrigger }

const modifiers = {
  flip: { enabled: false },
  preventOverflow: { enabled: false },
  hide: { enabled: false },
}

const PopupContext = React.createContext({})

function useClosePopup() {
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

export function PopupItem(props) {}

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

export function PopupMenuLink(props) {
  let close = useClosePopup()

  return <StyledPopupMenuItem as={Link} onClick={close} {...props} />
}
