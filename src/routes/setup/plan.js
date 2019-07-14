import { route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { ButtonLink } from 'components/button'
import Card from 'components/card'
import Icon from 'components/icon'
import { colors, media } from 'theme'

import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'

import littleWig from './little-wig.svg'
import standardWig from './standard-wig.svg'
import bigWig from './big-wig.svg'

export const Plan = ({
  planId,
  points,
  description,
  image,
  monthlyPrice,
  name,
  nameSize,
  nameWeight,
}) => (
  <div
    css={css`
      margin: 0 1.25rem 3rem;
      text-align: center;

      min-width: 280px;
      max-width: 280px;

      ${media.tabletPlus`
        flex: 1;
        min-width: 155px;
        max-width: 160px;
      `}
    `}>
    <img
      css={css`
        height: 2.5rem;
      `}
      src={image}
      alt={'person wearing ' + name}
    />
    <h3
      css={css`
        color: ${colors.text.default};
        font-size: ${nameSize};
        font-weight: ${nameWeight};
        line-height: 2rem;
        height: 2rem;
        margin: 0.25rem 0;
        vertical-align: baseline;
      `}>
      {name}
    </h3>
    <p
      css={css`
        color: ${colors.text.secondary};
        font-size: 0.8rem;
        margin: 0 auto 1rem;
        max-width: 160px;
      `}>
      {description}
    </p>
    <p
      css={css`
        color: ${colors.text.default};
      `}>
      <span
        css={css`
          display: block;
          font-size: 3rem;
          line-height: 3rem;
          margin-bottom: 0.25rem;
          margin-left: -1.1rem;
        `}>
        <span
          css={css`
            font-size: 70%;
            vertical-align: 0.75rem;
          `}>
          $
        </span>
        {monthlyPrice / 100}
      </span>
      a month
    </p>
    <ul
      css={css`
        color: ${colors.text.default};
        font-size: 0.8rem;
        text-indent: -1rem;
        margin-left: 1rem;
        margin-top: 1.5rem;
        line-height: 1.3rem;
        list-style: none;
        padding-left: 0;
        padding-right: 1rem;
        text-align: center;

        ${media.tabletPlus`
          min-height: 120px;
        `}

        li {
          margin: 0.3rem 0;
        }
      `}>
      {points.map((point, i) => (
        <li key={i}>
          {typeof point === 'string' ? (
            <>
              <Icon glyph="check" size="1rem" color={colors.ink.black} />
              {point}
            </>
          ) : (
            point
          )}
        </li>
      ))}
    </ul>
    <ButtonLink
      href={'../payment?plan=' + planId}
      css={css`
        margin: 1.5rem auto 0.5rem;

        ${media.phoneOnly`
          max-width: 150px;
        `}
      `}>
      Pick
    </ButtonLink>
  </div>
)

export const PhonePlanDivider = styled.hr`
  height: 1px;
  border: 0;
  background-color: ${colors.structure.border};
  margin: 0 30% 3rem;
  width: 60%;

  ${media.tabletPlus`
    display: none;
  `}
`

export const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 3rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6rem;
  margin: 1.5rem 0 3.5rem;
  text-align: center;
`

function Plans(props) {
  let littlePlanId = 'little-monthly'
  let balancedPlanId = 'balanced-monthly'
  let bigPlanId = 'bid-monthly'

  return (
    <Card radius="small">
      <Title>
        <Icon glyph="stamp" size="4rem" color={colors.ink.mid} />
        <br />
        <br />
        Which wig are you?
      </Title>
      <Description>
        A wig gives you the power of vouch. <br />
        Pick a wig to add your voice to the conversation.
      </Description>
      <div
        css={css`
          display: flex;
          flex-wrap: wrap-reverse;
          justify-content: center;
          margin: 0 auto;
          padding: 0 1rem;
        `}>
        <PhonePlanDivider />
        <Plan
          planId={bigPlanId}
          name="Big Wig"
          description="For the maximum possible exposure"
          nameSize="1.4rem"
          nameWeight="500"
          image={bigWig}
          monthlyPrice={1000}
          points={[
            'Get 5 vouches a day',
            'Get 4+ casts a day',
            "We'll vouch for you :-)",
          ]}
        />
        <PhonePlanDivider />
        <Plan
          planId={balancedPlanId}
          name="Balanced Wig"
          description="Gives you the most vouch for your cash"
          nameSize="1.3rem"
          nameWeight="400"
          image={standardWig}
          monthlyPrice={500}
          points={[
            'Get 3 vouches a day',
            'Get 3+ casts a day',
            'Pick any available username',
          ]}
        />
        <PhonePlanDivider />
        <Plan
          planId={littlePlanId}
          name="Little Wig"
          description="Everything you need to get started"
          nameSize="1.2rem"
          nameWeight="300"
          image={littleWig}
          monthlyPrice={200}
          points={[
            'Get 1 vouch a day',
            'Get 2+ casts a day',
            <>
              <Icon size="1rem" />
              <em>Your username must contain a number</em>
            </>,
          ]}
        />
        <PhonePlanDivider />
      </div>

      <div
        css={css`
          margin: 1rem 0 5rem;
          text-align: center;
        `}>
        <h3
          css={css`
            color: ${colors.text.default};
            font-size: 1rem;
            font-weight: 400;
            margin-bottom: 1rem;
          `}>
          Not ready for your wig?
        </h3>
        <p
          css={css`
            color: ${colors.text.secondary};
            margin-bottom: 1rem;
            font-size: 0.8rem;
          `}>
          You can continue for free, but you won't be able to vouch, <br />
          and you'll only be able to make one cast a day.
        </p>
        <Button inline outline color={colors.ink.mid}>
          Continue for free
        </Button>
      </div>
    </Card>
  )
}

export default wrapRouteWithSetupLayout(
  1,
  route({
    title: 'Which wig are you?',
    view: <Plans />,
  }),
)
