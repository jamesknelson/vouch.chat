import { useEffect, useState } from 'react'

export default function useLatestSnapshot(initialSnapshot) {
  let [latestSnapshot, setLatestSnapshot] = useState(initialSnapshot)
  useEffect(() => initialSnapshot.ref.onSnapshot(setLatestSnapshot), [
    initialSnapshot.ref,
  ])
  return latestSnapshot
}
