import { compose, route, withTitle } from 'navi'
import React from 'react'
import { css } from 'styled-components/macro'

import Button from 'components/button'
import Card from 'components/card'
import { TextareaControl } from 'components/control'
import FlexBox from 'components/flexBox'
import { useCurrentUser } from 'context'
import authenticated from 'utils/authenticated'
import { Gap } from 'components/sections'
import { TabletPlus } from 'components/media'
import Tooltip from 'components/tooltip'

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
    <div
      {...props}
      css={css`
        padding: 1rem 1rem;
      `}>
      <TabletPlus>
        <Gap size={3} />
      </TabletPlus>
      <div
        css={css`
          margin: 0 auto 2rem;
          max-width: 32rem;
        `}>
        <Card padding={1.5} radius="small">
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
        </Card>
      </div>
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
