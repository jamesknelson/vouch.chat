import { map, route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { ButtonLink } from 'components/button'
import Icon from 'components/icon'
import PlansGrid from 'components/plansGrid'
import useOperation from 'hooks/useOperation'
import chooseFreePlan from 'operations/chooseFreePlan'
import { colors } from 'theme'

import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'

import { useNavigation } from 'react-navi'
import { useCurrentUser } from 'context'

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
  let currentUser = useCurrentUser()
  let navigation = useNavigation()
  let chooseFreePlanOperation = useOperation(chooseFreePlan, {
    onSuccess: async () => {
      await navigation.navigate(
        currentUser.canSetUsername ? '/setup/username/' : '/setup/verify',
      )
    },
  })

  return (
    <>
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
      <PlansGrid plans={props.plans} />

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
        {currentUser ? (
          <Button
            inline
            outline
            color={colors.ink.mid}
            busy={chooseFreePlanOperation.busy}
            disabled={chooseFreePlanOperation.busy}
            onClick={chooseFreePlanOperation.invoke}>
            Continue for free
          </Button>
        ) : (
          <ButtonLink inline outline color={colors.ink.mid} href="/join">
            Continue for free
          </ButtonLink>
        )}
      </div>
    </>
  )
}

export default wrapRouteWithSetupLayout(
  1,
  map(async ({ context, state }) => {
    let backend = context.backend
    let getPlans = backend.functions.httpsCallable('api-getPlans')

    let plans = state.plans
    if (!plans) {
      const { data } = await getPlans()
      plans = data
    }

    return route({
      state: { plans },
      title: 'Which wig are you?',
      view: <Plans plans={plans} />,
    })
  }),
)
