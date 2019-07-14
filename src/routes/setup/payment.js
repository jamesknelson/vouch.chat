import { route } from 'navi'
import React from 'react'
import styled from 'styled-components/macro'

import Card from 'components/card'
import { colors } from 'theme'

import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'

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

function Payment(props) {
  return (
    <Card radius="small">
      <Title>Great choice!</Title>
      <Description />
    </Card>
  )
}

export default wrapRouteWithSetupLayout(
  1,
  route({
    title: 'Great choice!',
    view: <Payment />,
  }),
)
