import { compose, map, redirect, route, withState } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { ButtonLink, FormSubmitButton } from 'components/button'
import Card from 'components/card'
import CardForm from 'components/cardForm'
import Currency from 'components/currency'
import useOperation from 'hooks/useOperation'
import subscribeToPlan from 'operations/subscribeToPlan'
import updateBillingDetails from 'operations/updateBillingDetails'
import loading from 'routes/loading'
import { colors } from 'theme'
import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'
import { useNavigation } from 'react-navi'

const InnerClamp = styled.div`
  margin: 1rem auto;
  width: calc(100% - 2rem);
  padding-bottom: 3rem;
  max-width: calc(320px);
  position: relative;
`

const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6rem;
  margin: 1.5rem 0 3rem;
  text-align: center;
`

function Subscribe({ plan }) {
  let navigation = useNavigation()
  let subscribeToPlanOperation = useOperation(subscribeToPlan, {
    onSuccess: async () => {
      await navigation.getRoute()
    },
    defaultProps: {
      planId: plan.id,
    },
  })
  let updateCardOperation = useOperation(updateBillingDetails, {
    onSuccess: subscribeToPlanOperation.invoke,
  })

  return (
    <InnerClamp>
      <Title>Great choice!</Title>
      <Description>Now show us the money.</Description>
      <CardForm
        onSubmit={updateCardOperation.invoke}
        validate={updateCardOperation.validate}>
        <FormSubmitButton
          css={css`
            margin-top: 1.5rem;
            width: 100%;
          `}>
          Pay <Currency amount={plan.amount} currency={plan.currency} />
        </FormSubmitButton>
      </CardForm>
    </InnerClamp>
  )
}

const InactivePlan = () => {
  return (
    <Card radius="small">
      <Title>Oops!</Title>
      <Description>
        It looks like that plan is no longer accepting subscriptions.
      </Description>
      <ButtonLink
        css={css`
          margin-top: 1.5rem;
          width: 100%;
        `}
        href="/wigs">
        See Plans
      </ButtonLink>
    </Card>
  )
}

export default wrapRouteWithSetupLayout(
  1,
  map(async ({ context, params, state }) => {
    let backend = context.backend
    let getPlan = backend.functions.httpsCallable('api-getPlan')

    let plan = state.plan
    if (!plan) {
      let response = await getPlan(params.planId)
      plan = response.data
    }

    if (context.currentUser === undefined) {
      return compose(
        withState({ plan }),
        loading,
      )
    }

    if (!context.currentUser) {
      return redirect(`/join?planId=${params.planId}`)
    }
    if (context.currentUser.hasActiveSubscription) {
      return redirect(
        // The payment page relies on this redirect to move forward to the
        // username page once payment is complete.
        !context.currentUser.username
          ? `/setup/username`
          : `/settings/billing?planId=${params.planId}`,
      )
    }

    if (!plan.active) {
      return route({
        title: 'Setup your account',
        state: { plan },
        view: <InactivePlan />,
      })
    }

    return route({
      title: 'Setup your account',
      state: {
        plan,
      },
      view: <Subscribe plan={plan} />,
    })
  }),
)
