import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { space, typography } from 'styled-system'

import { UserAvatarLink } from 'components/avatar'
import Button, { IconButton } from 'components/button'
import { MenuItem } from 'components/menu'
import { PopupProvider, PopupTrigger, PopupMenu } from 'components/popup'
import { Box, Strong, Text } from 'components/responsive'
import { colors } from 'theme'
import Tooltip from 'components/tooltip'

export const LogDivider = styled.div`
  border-top: 1px solid ${colors.structure.divider};
  margin-top: 1rem;
  padding-top: 1rem;
  width: 100%;
`

const StyledLog = styled.section`
  ${space};
  display: flex;
`

const StyledHeader = styled.header`
  line-height: 0.95rem;
  margin-bottom: 0.5rem;

  ${typography};
`

const StyledDisplayName = styled.span`
  color: ${colors.text.default};
  font-weight: 700;
`

const StyledUsername = styled.span`
  color: ${colors.text.tertiary};
  margin: 0 0.375rem;
`

const StyledTime = styled.time`
  color: ${colors.text.tertiary};
  margin-left: 0.375rem;
`

const StyledMoreButton = styled(IconButton)`
  float: right;
  margin-top: -1.125rem;
  margin-right: -0.5rem;
`

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  margin-top: 0.25rem;
`

const formatShortDate = date =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

export function Log({ log, ...rest }) {
  let { text, member, vouchedBy } = log
  let [isVouching, setIsVouching] = useState(false)
  let [vouchError, setVouchError] = useState(null)

  let handleClickVouch = () => {
    setIsVouching(true)
    setTimeout(() => {
      setVouchError('Something went wrong.')
      setIsVouching(false)
    }, 1000)
  }

  return (
    <StyledLog {...rest}>
      <UserAvatarLink user={member} />
      <Box flex="1" marginLeft="0.5rem">
        <StyledHeader
          fontSize={{
            default: '0.9rem',
            tabletPlus: '0.95rem',
          }}>
          <StyledDisplayName>{member.displayName}</StyledDisplayName>
          <StyledUsername>@{member.username}</StyledUsername>
          &middot;
          <StyledTime>{formatShortDate(log.publishedAt)}</StyledTime>
          <PopupProvider triggerOnSelect>
            <PopupTrigger>
              {ref => (
                <StyledMoreButton
                  color={colors.ink.mid}
                  glyph="more-horizontal"
                  size="1rem"
                  ref={ref}
                />
              )}
            </PopupTrigger>
            <PopupMenu placement="bottom-end">
              <MenuItem>Burn</MenuItem>
              <MenuItem>Delete</MenuItem>
            </PopupMenu>
          </PopupProvider>
        </StyledHeader>
        <Text
          fontSize={{
            default: '1rem',
            tabletPlus: '1.1rem',
          }}>
          {text}
        </Text>
        <StyledFooter>
          <Tooltip
            content={vouchError}
            enabled={!!vouchError}
            placement="bottom-start">
            <Button
              busy={isVouching}
              color={colors.control.icon.default}
              disabled={isVouching}
              glyph={vouchError ? 'warning' : 'stamp'}
              glyphColor={colors.control.icon.default}
              inline
              marginLeft="-0.375rem"
              marginRight="0.5rem"
              size="small"
              text
              onClick={handleClickVouch}>
              {vouchedBy.length ? (
                <>
                  <Strong>{vouchedBy.length}</Strong>{' '}
                  {vouchedBy.length === 1 ? 'vouch' : 'vouches'}
                </>
              ) : (
                'Vouch'
              )}
            </Button>
          </Tooltip>
          {vouchedBy.map(member => (
            <UserAvatarLink
              css={css`
                border: 1px solid ${colors.structure.bg};
                margin-right: -3px;
              `}
              inline
              key={member.username}
              size="1.375rem"
              user={member}
            />
          ))}
        </StyledFooter>
      </Box>
    </StyledLog>
  )
}
