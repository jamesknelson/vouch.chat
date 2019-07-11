import React from 'react'
import { css } from 'styled-components/macro'
import { media } from 'theme'

export default function TwinColumnLayout({ left, right, primary = 'right' }) {
  return (
    <div
      css={css`
        ${media.tabletPlus`
          display: grid;
          grid-template-columns: minmax(320px, 400px) minmax(320px, 400px) 1fr;
          grid-template-rows: 100%;
          grid-template-areas: 'index content content';
          gap: 1rem;
          margin: 0 1rem;
        `}
      `}>
      <div
        css={css`
          grid-area: index;
          ${primary === 'right' &&
            media.phoneOnly`
            display: none
          `}

          ${media.tabletPlus`
            position: sticky;
            top: 0;
            height: 100vh;
          `}
        `}>
        {left}
      </div>
      <div
        css={css`
          grid-area: content;
          ${primary === 'left' &&
            media.phoneOnly`
            display: none
          `}
        `}>
        {right}
      </div>
    </div>
  )
}
