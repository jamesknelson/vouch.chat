import React from 'react'
import Tippy from '@tippy.js/react'

import useMediaQuery from 'hooks/useMedia'
import { mediaQueries } from 'theme'

export default function Tooltip({ children, placement = 'top', content }) {
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  if (isPhone) {
    return children
  } else {
    return (
      <Tippy
        placement={placement}
        touch={false}
        arrow={true}
        arrowType="round"
        content={content}>
        {children}
      </Tippy>
    )
  }
}
