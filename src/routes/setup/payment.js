import { compose, map, redirect, route, withState } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { ButtonLink, FormSubmitButton } from 'components/button'
import Card from 'components/card'
import CardForm from 'components/cardForm'
import Currency from 'components/currency'
import useOperation from 'hooks/useOperation'
import payAndSubscribe from 'operations/payAndSubscribe'
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

function Payment({ plan }) {
  let navigation = useNavigation()
  let operation = useOperation(payAndSubscribe, {
    defaultProps: {
      planId: plan.id,
      language: 'en',
    },
    onSettled: async issue => {
      if (!issue) {
        await navigation.navigate('/setup/username?thankyou')
      }
    },
  })

  return (
    <Card radius="small">
      <InnerClamp>
        <Title>Great choice!</Title>
        <Description>Now show us the money.</Description>
        <CardForm onSubmit={operation.invoke} validate={operation.validate}>
          <FormSubmitButton
            css={css`
              margin-top: 1.5rem;
              width: 100%;
            `}>
            Pay <Currency amount={plan.amount} currency={plan.currency} />
          </FormSubmitButton>
        </CardForm>
      </InnerClamp>
    </Card>
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
        href="../plan">
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
      let response = await getPlan(params.plan)
      plan = response.data
      // planPromise = Promise.resolve({
      //   data: {
      //     currency: 'usd',
      //     amount: 1000,
      //     active: true,
      //     id: 'big-monthly',
      //   },
      // })
    }

    if (context.currentUser === undefined) {
      return compose(
        withState({ plan }),
        loading,
      )
    }

    if (!context.currentUser) {
      return redirect(`/join?plan=${params.plan}`)
    }
    if (context.currentUser.hasActiveSubscription) {
      return redirect(`/settings/billing?plan=${params.plan}`)
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
      state: { plan },
      view: <Payment plan={plan} />,
    })
  }),
)
