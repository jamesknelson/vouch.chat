import { useEffect, useState } from 'react'

export default function useLatestSnapshot(ref, initialSnapshot) {
  let [latestSnapshot, setLatestSnapshot] = useState(initialSnapshot)
  useEffect(() => ref.onSnapshot(setLatestSnapshot), [ref])
  return latestSnapshot
}
