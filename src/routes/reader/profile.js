import { map, route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { UserAvatar } from 'components/avatar'
import Button, { ButtonLink, IconButton } from 'components/button'
import { Log, LogDivider } from 'components/log'
import { Box, Text, Title, FlexBox } from 'components/responsive'
import { Section } from 'components/sections'
import { useCurrentUser } from 'context'
import { colors, dimensions } from 'theme'

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
          `}
          marginLeft={{
            default: '0.5rem',
            tabletPlus: '1rem',
          }}
        />
      </Header>
      {currentUser && currentUser.username === member.username ? (
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
      ) : (
        <FlexBox
          alignItems="center"
          css={css`
            position: absolute;
            right: 1rem;
            margin-top: 9rem;
          `}>
          <IconButton
            color={colors.control.icon.default}
            glyph="glasses"
            marginRight="0.5rem"
            outline
            size="1.25rem"
            tooltip="Add to reading list"
          />
          <Button
            color={colors.control.icon.default}
            glyph="stamp"
            href="/settings/profile"
            outline
            css={css`
              font-weight: 600;
              font-size: 0.85rem;
            `}>
            Vouch
          </Button>
        </FlexBox>
      )}
      <Box
        marginLeft={{
          default: '0.5rem',
          tabletPlus: '1rem',
        }}
        marginBottom="1rem">
        <Title
          fontSize="1.2rem"
          fontWeight="800"
          marginTop="5rem"
          marginBottom="0">
          {member.displayName}
        </Title>
        <Text color={colors.text.tertiary} fontSize="0.9rem">
          @{member.username}
        </Text>
      </Box>
      <Section paddingTop="1.5rem" paddingBottom="1.5rem" marginBottom="1rem">
        <Log
          paddingX={{
            default: '0.5rem',
            tabletPlus: '1rem',
          }}
          log={{
            id: 1,
            publishedAt: new Date(),
            text: "Look at me I'm saying silly things",
            member: member,
            vouchedBy: [member, member],
          }}
        />
        <LogDivider />
        <Log
          paddingX={{
            default: '0.5rem',
            tabletPlus: '1rem',
          }}
          log={{
            id: 1,
            publishedAt: new Date(),
            text: "Hello world! I'm a test log.",
            member: member,
            vouchedBy: [],
          }}
        />
      </Section>
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
