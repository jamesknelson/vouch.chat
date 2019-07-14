import React from 'react'
import styled, { css } from 'styled-components/macro'
import { StyledLink } from 'components/button'
import Card from 'components/card'
import { LayoutHeaderContent } from 'components/layout'
import { TabletPlus } from 'components/media'
import { colors, dimensions, media } from 'theme'

export const RelatedLinkGroup = styled.div`
  justify-content: space-between;
  display: flex;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`

export const RelatedLink = styled(StyledLink)`
  color: ${colors.ink.black};
  font-size: 11px;
  font-weight: 600;
  margin: 0.5rem 0 0;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    text-decoration: underline;
  }
  :nth-child(3) {
    flex-basis: 100%;
  }
`

export const Greeting = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.95rem;
  line-height: 1.4rem;
  margin: 1.5rem 0 1.75rem;
  text-align: center;
`

export const Instructions = styled.p`
  color: ${colors.text.default};
  line-height: 1.4rem;
  margin: 1.5rem 0 1rem;
  text-align: left;
`

export const Issue = styled.p`
  color: ${colors.text.warning};
  font-size: 90%;
  line-height: 1.4rem;
  margin: 0.5rem 0 0;
  text-align: left;
`

export const Title = styled.h1`
  color: ${colors.lightBlack};
  font-size: 1.4rem;
  font-weight: 900;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`

export const LayoutPageCard = ({
  verticalAlign = 'center',
  children,
  size = 'small',
  title,
  ...props
}) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      flex-direction: column;
      margin: 0 auto;
      padding: 0 ${size === 'small' ? '1rem' : '0'};
      width: 100%;
    `}>
    <TabletPlus
      css={css`
        ${size === 'large' &&
          css`
            padding-left: 1rem;
          `}
        width: 100%;
      `}>
      <LayoutHeaderContent />
    </TabletPlus>
    <div
      {...props}
      css={css`
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        ${size === 'small' &&
          css`
            max-width: ${dimensions.smallCenteredCardMaxWidth};
          `};
        width: 100%;
        justify-content: ${verticalAlign === 'top' ? 'flex-start' : 'center'};
        position: relative;

        ${media.tabletPlus`
          padding-bottom: 2rem;
        `}
        ${size === 'small' && media.phoneOnly`
          margin-top: 0.5rem;
        `}
      `}>
      <Card
        radius={size === 'small' ? 'medium' : 0}
        borders={size === 'small' ? true : [true, false]}
        css={css`
          font-size: 90%;
          padding: 2rem 1.5rem;
          text-align: center;

          ${media.mediumPhonePlus`
              padding: 2rem 2rem;
            `}
          ${media.tabletPlus`
              padding: 2rem 3rem;
            `}
        `}>
        <Title>{title}</Title>
        {children}
      </Card>
    </div>
  </div>
)

export default LayoutPageCard
