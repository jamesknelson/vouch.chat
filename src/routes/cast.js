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

function Cast(props) {
  let user = useCurrentUser()

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
          <TextareaControl minRows={4} placeholder="What do you have to say?" />
          <Gap size={0.75} />
          <FlexBox justifyContent="flex-end">
            <Button outline>Cast</Button>
            <Button
              css={css`
                margin-left: 0.5rem;
              `}>
              Cast & Vouch
            </Button>
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
