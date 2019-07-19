import { map, route } from 'navi'
import React from 'react'
import styled from 'styled-components/macro'

import loading from 'routes/loading'
import { colors } from 'theme'
import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'

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

function Profile({ plan }) {
  return (
    <InnerClamp>
      <Title>Profile</Title>
      <Description>Set it up.</Description>
    </InnerClamp>
  )
}

export default wrapRouteWithSetupLayout(
  3,
  map(async ({ context, params }) => {
    if (context.currentUser === undefined) {
      return loading
    }

    return route({
      title: 'Setup your profile',
      view: <Profile />,
    })
  }),
)
