import { lazy, map, redirect, route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { colors } from 'theme'
import { StyledLink } from 'components/button'
import { Clamp } from 'components/responsive'
import { useCurrentUser } from 'context'

import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'

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
  margin: 1.5rem 0 1rem;
  text-align: center;
`

function VerifyEmail() {
  let currentUser = useCurrentUser()

  return (
    <Clamp paddingBottom="3rem" maxWidth="380px">
      <Title>It's verification time.</Title>
      <Description>
        You should have received a verification email at:{' '}
        <strong
          css={css`
            display: block;
            font-size: 1rem;
            font-weight: 700;
            margin: 0.5rem 0;
          `}>
          {currentUser.email}
        </strong>
        Please click the link inside the email to continue.
      </Description>
      <p
        css={css`
          color: ${colors.text.secondary};
          font-size: 0.9rem;
          font-style: italic;
          font-weight: 300;
          line-height: 1.4rem;
          margin: 1.5rem 0 1rem;
          text-align: center;
        `}>
        Need to change your email? <br />
        You can do so in your{' '}
        <StyledLink href="/settings/account">account settings</StyledLink>.
      </p>
    </Clamp>
  )
}

export default wrapRouteWithSetupLayout(
  1,
  map(async ({ context }) => {
    let { currentUser } = context

    if (currentUser === undefined) {
      return lazy(() => import('../loading'))
    } else if (currentUser.canSetUsername) {
      return redirect('/setup/username')
    }

    return route({
      title: 'Verify your email',
      view: <VerifyEmail />,
    })
  }),
)
