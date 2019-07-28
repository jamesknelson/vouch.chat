import React from 'react'
import styled from 'styled-components/macro'
import { variant } from 'styled-system'

import { P } from 'components/responsive'
import { getFirstIssue } from 'utils/Issues'

const messageStyle = variant({
  key: 'messages',
})

const StyledMessage = styled(P)`
  ${messageStyle}
`

export function Message({ name, strings = {}, variant, ...rest }) {
  let hasString = typeof name === 'string'

  // TODO: handle this with i18n
  if (!strings.error) {
    strings.error = 'Something went wrong.'
  }
  if (!strings.dirty) {
    strings.dirty = 'You have unsaved changes.'
  }

  let string = strings[name || 'default'] || name

  return (
    // Even if the string is the empty string '', we want to render the
    // component. Otherwise, we'll skip it.
    hasString && (
      <StyledMessage variant={variant} {...rest}>
        {string}
      </StyledMessage>
    )
  )
}

export const FirstIssueMessage = ({ issues, ...rest }) => (
  <Message name={getFirstIssue(issues)} variant="issue" {...rest} />
)

export function MessageSpan(props) {
  return <Message as="span" {...props} />
}
