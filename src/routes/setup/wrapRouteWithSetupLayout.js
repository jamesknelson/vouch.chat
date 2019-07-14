import { rgba } from 'polished'
import { compose, withData, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'
import styled, { css } from 'styled-components/macro'

import { LayoutHeaderContent } from 'components/layout'
import ProfileFlipper from 'components/layout/layoutProfileFlipper'
import { TabletPlus } from 'components/media'
import Tooltip from 'components/tooltip'
import { colors } from 'theme'

const OnboardingPosition = ({ active, complete, percentage, tooltip }) => (
  <Tooltip content={tooltip} placement="bottom">
    <div
      css={css`
        height: calc(0.75rem + 1px);
        width: calc(0.75rem + 1px);
        position: absolute;
        left: ${percentage}%;
        margin-left: -0.375rem;
        top: -0.375rem;
        border-radius: 9999px;
        background-color: ${colors.structure.wash};
        box-shadow: 0 0 0 1.2px ${colors.ink.black} inset,
          0 0 10px ${rgba(colors.ink.black, 0.12)},
          0 0 10px ${rgba(colors.ink.black, 0.12)} inset;
      `}>
      {(active || complete) && (
        <InnerOnboardingPosition
          color={active ? colors.ink.mid : colors.ink.black}
        />
      )}
    </div>
  </Tooltip>
)

const InnerOnboardingPosition = styled.div`
  position: absolute;
  height: calc(0.5rem + 1px);
  width: calc(0.5rem + 1px);
  left: 0.125rem;
  top: 0.125rem;
  background-color: ${props => props.color};
  border-radius: 9999px;
`

const OnboardingFlowIndicator = ({ step }) => (
  <div
    css={css`
      position: relative;
      margin: 0 calc(0.375rem + 1px);
    `}>
    <div
      css={css`
        border-radius: 9999px;
        box-shadow: 0 0 0 1px ${colors.ink.black} inset,
          0 0 10px 0px ${rgba(colors.ink.black, 0.33)},
          0 0 3px 1px ${rgba(colors.ink.black, 0.1)};
        width: 150px;
        height: 1px;
      `}
    />
    <OnboardingPosition
      percentage={0}
      active={step === 1}
      complete={step > 1}
      tooltip="Pick your wig"
    />
    <OnboardingPosition
      percentage={50}
      active={step === 2}
      complete={step > 2}
      tooltip="Pick your username"
    />
    <OnboardingPosition
      percentage={100}
      active={step === 3}
      complete={step > 3}
      tooltip="Make a cast"
    />
  </div>
)

function SetupLayout({ step }) {
  let onboardingIndicator = <OnboardingFlowIndicator step={step} />

  return (
    <div
      css={css`
        padding: 0 1rem;
      `}>
      <TabletPlus>
        <LayoutHeaderContent actions={onboardingIndicator} />
      </TabletPlus>
      {/* <PhoneOnly
        css={css`
          height: 2rem;
          width: 160px;
          margin: 1rem auto 0;
        `}>
        {onboardingIndicator}
      </PhoneOnly> */}
      <div
        css={css`
          margin: 0 auto 2rem;
          max-width: 800px;
        `}>
        <View />
      </div>
    </div>
  )
}

export default function wrapRouteWithSetupLayout(step, route) {
  return compose(
    withData({
      minimalLayout: true,
      layoutHeaderTitle: null,
      layoutHeaderActions: (
        <ProfileFlipper style={{ marginRight: '1rem' }} withoutSpinner />
      ),
    }),
    withView(<SetupLayout step={step} />),
    route,
  )
}
