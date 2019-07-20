import React from 'react'
import { css } from 'styled-components/macro'

import addDefaultRemUnits from 'utils/addDefaultRemUnits'

const DEFAULT_ICON_SIZE = '2rem'

const Icon = React.forwardRef(
  ({ glyph, label, size = DEFAULT_ICON_SIZE, color, ...props }, ref) => {
    size = addDefaultRemUnits(size)

    return (
      <span
        {...props}
        ref={ref}
        role="img"
        aria-label={label}
        className={`icon-${glyph} ${props.className || ''}`}
        css={css`
          display: inline-block;
          font-size: ${size};
          text-align: center;
          line-height: ${size};
          height: ${size};
          width: ${size};

          ${color &&
            css`
              color: ${color};
            `}
        `}
      />
    )
  },
)

export default Icon
