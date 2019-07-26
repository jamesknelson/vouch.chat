import { map, route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { UserAvatar } from 'components/avatar'
import { useCurrentUser } from 'context'
import { colors, dimensions } from 'theme'
import { ButtonLink } from 'components/button'

const Header = styled.header`
  background-color: ${colors.ink.black};
  display: flex;
  height: calc(2 * ${dimensions.bar});
`

function Profile({ member, username }) {
  let currentUser = useCurrentUser()

  if (!member) {
    return (
      <div
        css={css`
          margin: 0 auto;
          text-align: center;
        `}>
        <h1
          css={css`
            color: ${colors.text.default};
            font-weight: bold;
            margin-top: 4rem;
            margin-bottom: 1rem;
          `}>
          Oh dear
        </h1>
        <p
          css={css`
            color: ${colors.text.secondary};
          `}>
          This user doesn't seem to exist.
        </p>
      </div>
    )
  }

  return (
    <>
      <Header>
        <UserAvatar
          size={8}
          user={member}
          css={css`
            border: 0.25rem solid ${colors.structure.bg};
            margin-top: 4rem;
            margin-left: 1rem;
          `}
        />
      </Header>
      {currentUser && (
        <ButtonLink
          href="/settings/profile"
          outline
          css={css`
            position: absolute;
            right: 1rem;
            margin-top: 9rem;
          `}>
          Edit Profile
        </ButtonLink>
      )}
      <h1
        css={css`
          color: ${colors.text.default};
          font-size: 1.2rem;
          font-weight: 800;
          margin-left: 1rem;
          margin-top: 5rem;
        `}>
        {member.displayName}
      </h1>
      <p
        css={css`
          color: ${colors.text.tertiary};
          font-size: 0.9rem;
          font-weight: 400;
          margin-left: 1rem;
        `}>
        @{member.username}
      </p>
    </>
  )
}

export default map(async ({ context, params, state }) => {
  let { backend } = context
  let username = params.username.toLowerCase()

  let member = state.member
  if (!member) {
    let query = backend.db
      .collection('members')
      .where('username', '==', username)
      .limit(1)

    let querySnapshot = await query.get()

    if (!querySnapshot.empty) {
      let memberSnapshot = querySnapshot.docs[0]
      member = memberSnapshot && memberSnapshot.data()
    }
  }

  return route({
    state: { member },
    status: member ? 200 : 404,
    title: member ? member.displayName : 'Not Found',
    view: <Profile member={member} username={username} />,
  })
})
