import React from 'react'
import Tippy from '@tippy.js/react'

import useMediaQuery from 'hooks/useMedia'
import { mediaQueries } from 'theme'

export default function Tooltip({
  children,
  placement = 'top',
  content,
  enabled,
  ...rest
}) {
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
        content={content || <></>}
        enabled={enabled === undefined ? !!content : enabled}
        {...rest}>
        {children}
      </Tippy>
    )
  }
}
