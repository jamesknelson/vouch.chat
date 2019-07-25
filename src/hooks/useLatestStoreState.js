import { useEffect, useState } from 'react'

export default function useLatestStoreState(store) {
  let [latestStoreState, setLatestStoreState] = useState(() => store.getState())

  useEffect(() => {
    let latestState = store.getState()
    if (latestState !== latestStoreState) {
      setLatestStoreState(latestState)
    }

    return store.subscribe(() => {
      setLatestStoreState(store.getState())
    })
    // We only want to check latestStoreState on mount, in case it has
    // changed between the initial render, and the time the effect is called.
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [store])

  return latestStoreState
}
