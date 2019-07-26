import { compose, route, withTitle } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'

import Button from 'components/button'
import Card from 'components/card'
import { TextareaControl } from 'components/control'
import { Box, FlexBox, Gap } from 'components/responsive'
import Tooltip from 'components/tooltip'
import { useCurrentUser } from 'context'
import authenticated from 'utils/authenticated'
import { radii } from 'theme'
import { UserAvatar } from 'components/avatar'

function Cast(props) {
  let user = useCurrentUser()
  let canVouch = user.availableVouches === 0 ? 0.5 : 1

  let castAndVouchButton = (
    <Button
      css={css`
        margin-left: 0.5rem;
        opacity: ${canVouch ? 1 : 0};
      `}>
      Cast & Vouch
    </Button>
  )

  return (
    <div {...props}>
      <Gap size={{ default: 0, tabletPlus: 4 }} />
      <Card
        margin={{
          default: '1rem 0',
          tabletPlus: '0 auto 2rem',
        }}
        maxWidth={{
          tabletPlus: '32rem',
        }}
        paddingTop="1.5rem"
        paddingBottom="1rem"
        paddingX={{
          default: '1rem',
          tabletPlus: '1.5rem',
        }}
        borderRadius={{
          default: '0',
          tabletPlus: radii.small,
        }}>
        <FlexBox justifyContent="stretch">
          <UserAvatar user={user} />
          <Box flex="1" marginLeft="1rem">
            <TextareaControl
              minRows={4}
              placeholder="What would you like to say?"
            />
            <Gap size={0.75} />
            <FlexBox justifyContent="flex-end">
              <Button outline>Cast</Button>
              {canVouch ? (
                castAndVouchButton
              ) : (
                <Tooltip
                  content={
                    user.hasActiveSubscription
                      ? 'You have no vouches left'
                      : 'Get a wig and start to vouching'
                  }>
                  {castAndVouchButton}
                </Tooltip>
              )}
            </FlexBox>
          </Box>
        </FlexBox>
      </Card>
    </div>
  )
}

export default compose(
  withTitle('Cast'),
  authenticated(
    route({
      view: <Cast />,
    }),
  ),
)
