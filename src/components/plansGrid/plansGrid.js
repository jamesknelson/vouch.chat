import React from 'react'
import styled, { css } from 'styled-components/macro'

import { ButtonLink } from 'components/button'
import Icon from 'components/icon'
import { colors, media } from 'theme'

import littleWig from './little-wig.svg'
import standardWig from './standard-wig.svg'
import bigWig from './big-wig.svg'

const Plan = ({
  planId,
  currentPlanPrice,
  isCurrentPlan,
  points,
  description,
  image,
  monthlyPrice,
  name,
  nameSize,
  nameWeight,
  selectPathname,
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
      disabled={isCurrentPlan}
      href={{ pathname: selectPathname, query: { planId } }}
      outline={currentPlanPrice > monthlyPrice}
      css={css`
        margin: 1.5rem auto 0.5rem;

        ${media.phoneOnly`
          max-width: 150px;
        `}
      `}>
      {isCurrentPlan
        ? 'Your Wig'
        : typeof currentPlanPrice !== 'number'
        ? 'Select'
        : currentPlanPrice < monthlyPrice
        ? 'Upgrade'
        : 'Downgrade'}
    </ButtonLink>
  </div>
)

const PhonePlanDivider = styled.hr`
  height: 1px;
  border: 0;
  background-color: ${colors.structure.border};
  margin: 0 30% 3rem;
  width: 60%;

  ${media.tabletPlus`
    display: none;
  `}
`

export default function Plans({ currentPlan, plans, selectPathname, ...rest }) {
  let [bigPlan, mediumPlan, smallPlan] = plans

  return (
    <div
      {...rest}
      css={css`
        display: flex;
        flex-wrap: wrap-reverse;
        justify-content: center;
        margin: 0 auto;
        padding: 0 1rem;
      `}>
      <PhonePlanDivider />
      <Plan
        planId={bigPlan.id}
        isCurrentPlan={currentPlan && currentPlan.id === bigPlan.id}
        currentPlanPrice={currentPlan && currentPlan.amount}
        selectPathname={selectPathname}
        name={bigPlan.name}
        description="For the maximum possible exposure"
        nameSize="1.4rem"
        nameWeight="500"
        image={bigWig}
        monthlyPrice={bigPlan.amount}
        points={[
          `Get ${bigPlan.dailyVouches} vouches a day`,
          'Pick any available username',
        ]}
      />
      <PhonePlanDivider />
      <Plan
        planId={mediumPlan.id}
        isCurrentPlan={currentPlan && currentPlan.id === mediumPlan.id}
        currentPlanPrice={currentPlan && currentPlan.amount}
        selectPathname={selectPathname}
        name={mediumPlan.name}
        description="Gives you the most vouch for your cash"
        nameSize="1.3rem"
        nameWeight="400"
        image={standardWig}
        monthlyPrice={mediumPlan.amount}
        points={[
          `Get ${mediumPlan.dailyVouches} vouches a day`,
          'Pick any available username',
        ]}
      />
      <PhonePlanDivider />
      <Plan
        planId={smallPlan.id}
        isCurrentPlan={currentPlan && currentPlan.id === smallPlan.id}
        currentPlanPrice={currentPlan && currentPlan.amount}
        selectPathname={selectPathname}
        name={smallPlan.name}
        description="Everything you need to get started"
        nameSize="1.2rem"
        nameWeight="300"
        image={littleWig}
        monthlyPrice={smallPlan.amount}
        points={[
          `Get ${smallPlan.dailyVouches} vouch a day`,
          'Pick any available username',
        ]}
      />
      <PhonePlanDivider />
    </div>
  )
}
