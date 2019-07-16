import React from 'react'
import { css } from 'styled-components/macro'

export default function Currency({ currency, amount }) {
  const CurrencySymbols = {
    usd: (
      <>
        <span
          css={css`
            font-size: 75%;
            vertical-align: 2.5px;
            margin-right: 2px;
          `}>
          USD
        </span>
        $
      </>
    ),
    yen: '¥',
  }

  let symbol = CurrencySymbols[currency.toLowerCase()] || currency + ' '
  let formattedAmount =
    currency === 'yen'
      ? amount
      : amount % 100 === 0
      ? amount / 100
      : (amount / 100).toFixed(2)
  return (
    <>
      {symbol}
      {formattedAmount}
    </>
  )
}
