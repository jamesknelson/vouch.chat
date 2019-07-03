import React from 'react'
import styled, { css } from 'styled-components/macro'
import {
  AuthLinkButton,
  Button,
  ButtonLink,
  FormSubmitButton,
  StyledLink,
} from 'components/button'
import Card from 'components/card'
import { Header } from 'components/layout'
import { colors, dimensions, media } from 'theme'

export const StyledButton = styled(Button)`
  margin: 1rem 0;
  width: 100%;
`

export const StyledFormSubmitButton = styled(FormSubmitButton)`
  margin: 1rem 0;
  width: 100%;
`

export const StyledAuthButtonLink = styled(AuthLinkButton)`
  margin: 1rem 0;
  width: 100%;
`

export const StyledButtonLink = styled(ButtonLink)`
  margin: 1rem 0;
  width: 100%;
`

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
  margin: 0.5rem 0 1rem;
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

export const CenteredCardLayout = ({ children, title, ...props }) => (
  <>
    <Header />
    <div
      {...props}
      css={css`
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: stretch;
        ${media.phoneOnly`
          padding: 0 1rem;
          margin-top: -6rem;
        `}
        ${media.tabletPlus`
          padding: 1rem 1rem 1rem;
        `}
      `}>
      <div
        css={css`
          flex-grow: 1;
          max-width: ${dimensions.narrowCard};
          width: 100%;
          margin: 0 auto;
          position: relative;
        `}>
        <Card
          radius="medium"
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
  </>
)

export default CenteredCardLayout
