import { useCallback, useState } from 'react'

export default function useToggle(defaultState = false) {
  let [state, setState] = useState(defaultState)
  let enable = useCallback(() => {
    setState(true)
  }, [])
  let disable = useCallback(() => {
    setState(false)
  }, [])
  let toggle = useCallback(() => {
    setState(!state)
  }, [state])
  return [state, enable, disable, toggle]
}
