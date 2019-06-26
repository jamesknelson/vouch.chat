import { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import PopupTrigger from 'popup-trigger'

const UnsetPopupDebounce = 500

function useTrigger(options = {}) {
  let triggerRef = useRef()
  if (!triggerRef.current) {
    triggerRef.current = new PopupTrigger(options)
  }
  let trigger = triggerRef.current

  let [state, setState] = useState(trigger.getState())

  let debounceRef = useRef()

  useEffect(() => {
    trigger.subscribe(setState)
    return () => trigger.dispose()
  }, [trigger])

  // Debounce nulling out the popup container to get around issues caused by
  // other badly handling refs, and causing `null` refs to be passed in.
  let popupRef = useCallback(
    node => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }

      if (node !== null) {
        trigger.setPopupNode(node)
      } else {
        debounceRef.current = setTimeout(() => {
          trigger.setPopupNode(null)
        }, UnsetPopupDebounce)
      }
    },
    [trigger],
  )

  return useMemo(
    () => ({
      ...state,
      close: trigger.close,
      ref: trigger.setTriggerNode,
      popupRef: popupRef,
    }),
    [state, trigger, popupRef],
  )
}

export default useTrigger
