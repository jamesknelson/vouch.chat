import { route } from 'navi'
import React from 'react'
import styled from 'styled-components/macro'

import LargeCardLayout, { Title } from 'components/largeCardLayout'
import { colors } from 'theme'

export const P = styled.p`
  color: ${props => colors.text[props.variant || 'secondary']};
  line-height: 1.4rem;
  margin-top: 1.5rem;
  text-align: center;
`

function Policies(props) {
  return (
    <LargeCardLayout>
      <Title>Policies and Terms</Title>
      <P>
        Your data is yours.
        <br />
        We will not sell your data.
        <br />
        Not to anyone.
      </P>

      <P>
        Don’t be an asshole.
        <br />
        Treat others with respect.
        <br />
        It’s a public space.
      </P>

      <P>
        We’re just a small team.
        <br />
        Anything could happen so
        <br />
        Sorry. Deal with it.
      </P>

      <P>
        There is one thing though.
        <br />
        Advertisements are bullshit.
        <br />
        We’ll never sell them.
      </P>

      <P>
        So please join a plan.
        <br />
        To support our adventure.
        <br />
        Or it may vanish.
      </P>
    </LargeCardLayout>
  )
}

export default route({
  data: {
    minimalLayout: true,
  },
  title: 'Policies',
  view: <Policies />,
})
