import { Picker } from 'emoji-mart'
import { compose, route, withTitle } from 'navi'
import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'

import { UserAvatar } from 'components/avatar'
import Button, { IconButton } from 'components/button'
import Card from 'components/card'
import { TextareaControl } from 'components/control'
import List, {
  ListItem,
  ListItemIcon,
  ListItemLink,
  ListItemText,
} from 'components/list'
import { Popup, PopupProvider, PopupTrigger } from 'components/popup'
import { Box, FlexBox, Gap, TabletPlus } from 'components/responsive'
import Tooltip from 'components/tooltip'
import { useCurrentUser } from 'context'
import { colors, radii } from 'theme'
import authenticated from 'utils/authenticated'

const MaxLength = 250

const StyledLengthIndicator = styled.span`
  color: ${props =>
    props.warning ? colors.text.warning : colors.text.tertiary};
  font-size: 0.8rem;
  margin-right: 1rem;
`

const LengthIndicator = ({
  length,
  maxLength = MaxLength,
  warningLength = 20,
  ...rest
}) => (
  <StyledLengthIndicator warning={maxLength - length < warningLength}>
    {length} / 250
  </StyledLengthIndicator>
)

function Log(props) {
  let user = useCurrentUser()
  let [summary, setSummary] = useState('')
  let [error, setError] = useState(false)

  let canPost = summary.length <= MaxLength

  let handleSubmit = () => {
    setError(true)
  }

  let handleSelectEmoji = emoji => {
    setSummary(summary + emoji.native)
  }

  return (
    <div
      {...props}
      css={css`
        .emoji-mart-preview {
          display: none;
        }
        .emoji-mart {
          border-width: 0;
        }
        .emoji-mart-bar {
          border-color: ${colors.structure.divider};
        }
      `}>
      <Gap size={{ default: 0, tabletPlus: 4 }} />
      <ResponsiveCard paddingTop="1.5rem" paddingBottom="1rem" paddingX="1rem">
        <FlexBox justifyContent="stretch">
          <UserAvatar user={user} />
          <Box flex="1" marginLeft="0.5rem">
            <TextareaControl
              minRows={4}
              placeholder="What's up?"
              value={summary}
              onChange={setSummary}
            />
          </Box>
        </FlexBox>
        <Gap size={0.75} />
        <FlexBox alignItems="center">
          <FlexBox
            flex={{
              default: '0 0 0',
              mediumPhonePlus: '0 1 2.5rem',
            }}
          />
          {/* <IconButton glyph="image" size="1.25rem" />
          <IconButton glyph="file-text" size="1.25rem" /> */}
          <TabletPlus>
            <PopupProvider triggerOnFocus triggerOnSelect>
              <PopupTrigger>
                {ref => <IconButton glyph="smile" size="1.25rem" ref={ref} />}
              </PopupTrigger>
              <Popup placement="bottom-start">
                <Picker emoji="" onSelect={handleSelectEmoji} />
              </Popup>
            </PopupProvider>
          </TabletPlus>
          <FlexBox flex="1" />
          <LengthIndicator length={summary.length} />
          <Tooltip
            content="Something went wrong."
            enabled={error}
            placement="left">
            <Button
              disabled={!canPost}
              busy={false}
              glyph={error ? 'warning' : null}
              onClick={handleSubmit}>
              Log
            </Button>
          </Tooltip>
        </FlexBox>
      </ResponsiveCard>
      <ListCard>
        <ListItem paddingX="1rem">
          <ListItemIcon glyph="stamp" width="3rem" paddingRight="0.5rem" />
          <ListItemText description="Vouch to increase visibility" />
          <Button busy={false} size="small" outline>
            Vouch
          </Button>
        </ListItem>
        {/* <ListItem paddingX="1rem">
          <ListItemIcon glyph="share" width="3rem" paddingRight="0.5rem" />
          <ListItemText description="Tell your friends" />
          <Button busy={false} size="small" outline>
            Share
          </Button>
        </ListItem> */}
      </ListCard>
      <ListCard>
        <ListItem paddingX="1rem" onClick={() => alert(1)}>
          <ListItemIcon glyph="edit" width="3rem" paddingRight="0.5rem" />
          <ListItemText description="Make another log" />
          <ListItemIcon glyph="chevron-right" />
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
