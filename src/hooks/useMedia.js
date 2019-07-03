/**
 * Based on https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/useMediaQuery/useMediaQuery.js
 * MIT License
 * Copyright (c) 2014 Call-Em-All
 */

import React from 'react'

// This variable will be true once the server-side hydration is completed.
let hydrationCompleted = false

function deepEqual(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index])
}

function useMediaQuery(queryInput, defaultMatches) {
  const multiple = Array.isArray(queryInput)
  let queries = multiple ? queryInput : [queryInput]
  queries = queries.map(query => query.replace('@media ', ''))

  const supportMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  const [matches, setMatches] = React.useState(() => {
    // TODO: what if hydration has partially completed, due to Suspense and
    // partial hydration?
    if (hydrationCompleted && supportMatchMedia) {
      return queries.map(query => window.matchMedia(query).matches)
    }

    // Once the component is mounted, we rely on the
    // event listeners to return the correct matches value.
    return queries.map((query, i) =>
      Array.isArray(defaultMatches) ? defaultMatches[i] : defaultMatches,
    )
  })

  React.useEffect(() => {
    hydrationCompleted = true

    if (!supportMatchMedia) {
      return undefined
    }

    const queryLists = queries.map(query => window.matchMedia(query))
    setMatches(prev => {
      const next = queryLists.map(queryList => queryList.matches)
      return deepEqual(prev, next) ? prev : next
    })

    function handleMatchesChange() {
      setMatches(queryLists.map(queryList => queryList.matches))
    }

    queryLists.forEach(queryList => {
      queryList.addListener(handleMatchesChange)
    })
    return () => {
      queryLists.forEach(queryList => {
        queryList.removeListener(handleMatchesChange)
      })
    }
  }, queries) // eslint-disable-line react-hooks/exhaustive-deps

  return multiple ? matches : matches[0]
}

export function testReset() {
  hydrationCompleted = false
}

export default useMediaQuery
