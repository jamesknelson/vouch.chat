import React from 'react'
import { css } from 'styled-components/macro'

import { Avatar } from 'components/avatar'
import { MenuDivider, MenuLink } from 'components/menu'
import { useCurrentUser } from 'context'
import { colors, media } from 'theme'

const MenuHeader = ({ displayName, username, photoURL }) => (
  <MenuLink
    href={`/${username}`}
    css={css`
      align-items: center;
      justify-content: space-between;
      display: flex;
    `}>
    <div>
      <h4
        css={css`
          color: ${colors.text.default};
          font-weight: 800;
          font-size: 1rem;
          padding-right: 1rem;

          ${media.phoneOnly`
            /* Allow standard line breaks on mobile as the menu
               will appear in a sidebar instead of a popup */
            white-space: normal;
          `}
        `}>
        {displayName}
      </h4>
      <p
        css={css`
          color: ${colors.text.tertiary};
          font-size: 0.8rem;
        `}>
        @{username}
      </p>
    </div>
    <Avatar
      photoURL={photoURL}
      css={css`
        flex-grow: 0;
        flex-shrink: 0;
      `}
    />
  </MenuLink>
)

export default function LayoutNavMenuItems() {
  let currentUser = useCurrentUser()

  if (currentUser === undefined) {
    return null
  }

  return currentUser ? (
    <>
      <MenuHeader
        displayName="James K Nelson"
        username="james"
        photoURL={currentUser.photoURL}
      />
      <MenuDivider />
      <MenuLink href="/settings">Settings</MenuLink>
      <MenuDivider />
      <MenuLink href="/logout">Logout</MenuLink>
    </>
  ) : (
    <>
      <MenuLink href="/login">Sign In </MenuLink>
      <MenuLink href="/join">Join</MenuLink>
    </>
  )
}
