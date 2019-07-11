import { useEffect, useRef, useState } from 'react'

/**
 * Listen for scroll events, and return the most recent scroll direction
 * once the user has scrolled at least `threshold` pixels in that direction.
 */
export default function useLastScrollDirection(threshold = 50) {
  // Scroll events can happen pretty frequently, so instead of storing the
  // the latest mark in state (which will re-render the entire component
  // on every scroll), we'll store instead in a ref and only update the
  // state as required.
  let [direction, setDirection] = useState(null)
  let stateRef = useRef({
    direction: undefined,
    mark: 0,
  })

  useEffect(() => {
    let setState = update => {
      let newDirection = update.direction
      let lastDirection = stateRef.current.direction
      stateRef.current = {
        ...stateRef.current,
        ...update,
      }

      // Publish an update
      if (newDirection && newDirection !== lastDirection) {
        setDirection(newDirection)
      }
    }

    let checkScroll = () => {
      let { direction, mark } = stateRef.current
      let pos = window.scrollY
      let diff = 0
      if (!direction) {
        diff = Math.abs(pos - mark)
      } else if (direction === 'down' && pos < mark) {
        diff = mark - pos
      } else if (direction === 'up' && pos > mark) {
        diff = pos - mark
      }
      if (diff >= threshold) {
        setState({
          mark: pos,
          direction: pos > mark ? 'down' : 'up',
        })
      } else if (diff === 0) {
        setState({
          mark: pos,
        })
      }
    }

    window.addEventListener('scroll', checkScroll, false)
    return () => {
      window.removeEventListener('scroll', checkScroll, false)
    }
  }, [threshold])

  return direction
}
