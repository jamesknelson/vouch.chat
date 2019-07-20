import React from 'react'
import styled, { css } from 'styled-components/macro'
import Card from 'components/card'
import { LayoutHeaderContent } from 'components/layout'
import { TabletPlus } from 'components/media'
import { colors, dimensions } from 'theme'

export const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6rem;
  margin: 1.5rem 0 1rem;
  text-align: center;
`

export const LargeCardLayout = ({
  actions,
  children,
  size = 'small',
  title,
  ...props
}) => {
  return (
    <div
      {...props}
      css={css`
        padding: 0 1rem;
      `}>
      <TabletPlus>
        <LayoutHeaderContent actions={actions} />
      </TabletPlus>
      <div
        css={css`
          margin: 0 auto 2rem;
          max-width: ${dimensions.largeCardWidth};
        `}>
        <Card
          radius="small"
          css={css`
            padding-bottom: 4rem;
          `}>
          {children}
        </Card>
      </div>
    </div>
  )
}

export default LargeCardLayout
