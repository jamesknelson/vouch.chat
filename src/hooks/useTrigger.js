import { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import Trigger from 'utils/Trigger'

const UnsetContainerDebounce = 500

function useTrigger(options = {}) {
  let triggerRef = useRef()
  if (!triggerRef.current) {
    triggerRef.current = new Trigger(options)
  }
  let trigger = triggerRef.current

  let [state, setState] = useState(trigger.getState())

  let debounceRef = useRef()

  useEffect(() => {
    trigger.subscribe(setState)
    return () => trigger.dispose()
  }, [trigger])

  // Debounce nulling out the container to get around issues caused by
  // other badly handling refs, and causing `null` refs to be passed in.
  let containerRef = useCallback(
    node => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }

      if (node !== null) {
        trigger.setContainerNode(node)
      } else {
        debounceRef.current = setTimeout(() => {
          trigger.setContainerNode(null)
        }, UnsetContainerDebounce)
      }
    },
    [trigger],
  )

  return useMemo(
    () => ({
      ...state,
      close: trigger.close,
      ref: trigger.setTriggerNode,
      containerRef: containerRef,
    }),
    [state, trigger, containerRef],
  )
}

export default useTrigger
