import { compose, route, withTitle } from 'navi'
import React from 'react'

import Button from 'components/button'
import Card from 'components/card'
import { TextareaControl } from 'components/control'
import { Box, FlexBox, Gap } from 'components/responsive'
import { useCurrentUser } from 'context'
import authenticated from 'utils/authenticated'
import { radii } from 'theme'
import { UserAvatar } from 'components/avatar'
import List, {
  ListItem,
  ListItemIcon,
  ListItemLink,
  ListItemText,
} from 'components/list'
import Tooltip from 'components/tooltip'

function Log(props) {
  let user = useCurrentUser()
  let error = true

  return (
    <div {...props}>
      <Gap size={{ default: 0, tabletPlus: 4 }} />
      <ResponsiveCard paddingTop="1.5rem" paddingBottom="1rem" paddingX="1rem">
        <FlexBox justifyContent="stretch">
          <UserAvatar user={user} />
          <Box flex="1" marginLeft="1rem">
            <TextareaControl minRows={4} placeholder="What's up?" />
            <Gap size={0.75} />
            <FlexBox justifyContent="flex-end">
              <Tooltip
                content="Something went wrong."
                enabled={error}
                placement="left">
                <Button busy={false} glyph={error ? 'warning' : null}>
                  Log
                </Button>
              </Tooltip>
            </FlexBox>
          </Box>
        </FlexBox>
      </ResponsiveCard>
      <ListCard>
        <ListItem paddingX="1rem">
          <ListItemIcon glyph="stamp" width="3rem" paddingRight="0.5rem" />
          <ListItemText description="Increase visibility" />
          <Button busy={false} size="small" outline>
            Vouch
          </Button>
        </ListItem>
        <ListItem paddingX="1rem">
          <ListItemIcon glyph="share" width="3rem" paddingRight="0.5rem" />
          <ListItemText description="Tell your friends" />
          <Button busy={false} size="small" outline>
            Share
          </Button>
        </ListItem>
      </ListCard>
      <ListCard>
        <ListItem paddingX="1rem" onClick={() => alert(1)}>
          <ListItemIcon glyph="edit" width="3rem" paddingRight="0.5rem" />
          <ListItemText description="Make another log" />
        </ListItem>
      </ListCard>
      <ListCard>
        <ListItemLink href={'/' + user.username} paddingX="1rem" active={false}>
          <ListItemIcon width="3rem" glyph="user" paddingRight="0.5rem" />
          <ListItemText description="View on your profile" />
          <ListItemIcon glyph="chevron-right" />
        </ListItemLink>
      </ListCard>
    </div>
  )
}

const ResponsiveCard = props => (
  <Card
    margin={{
      default: '1rem 0',
      tabletPlus: '0 auto 1rem',
    }}
    maxWidth={{
      tabletPlus: '32rem',
    }}
    borderRadius={{
      default: '0',
      tabletPlus: radii.small,
    }}
    {...props}
  />
)

const ListCard = ({ children, ...rest }) => (
  <ResponsiveCard {...rest}>
    <List>{children}</List>
  </ResponsiveCard>
)

export default compose(
  withTitle('Log'),
  authenticated(
    route({
      view: <Log />,
    }),
  ),
)
