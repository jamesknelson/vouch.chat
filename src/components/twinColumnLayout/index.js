import React from 'react'
import { css } from 'styled-components/macro'

// there should be a top header with the flipper/title/search bar on mobile
// which only appears initially, and when scrolling up -- like the twitter one.

// how do you automatically select the first thing to read on desktop, but
// not on mobile? you need media-query dependent routing :'-(

// need to update TabletPlus / PhoneOnly to use media queries to switch rendering
// instead of just hiding things w/ CSS, so that left/rhs of the layout won't
// be rendered on mobile as appropriate.

// desktop:
//
// - one column on left w/ cards, including possibly a top-hugging card,
//   or a full-height card that grows with content
// - right: just a big square card

// mobile:
//
// - can have stacked headers, where the secondary header has an "up" button
//   which scrolls to the top to pull down the primary header

export default function TwinColumnLayout({ left, right, primary }) {
  return (
    <div
      css={css`
        display: flex;
        min-height: 100%;
      `}>
      <div
        css={css`
          max-width: 320px;
          flex: 1;
        `}>
        {left}
      </div>
      <div
        css={css`
          flex: 2;
        `}>
        {right}
      </div>
    </div>
  )
}
