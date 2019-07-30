import styled from 'styled-components/macro'
import { color, space, typography } from 'styled-system'

import { colors } from 'theme'

export const Text = styled.div`
  ${space}
  ${typography}
  ${color}
`

export const P = styled.p`
  ${space}
  ${typography}
  ${color}
`

P.defaultProps = {
  color: colors.text.default,
  fontSize: '14px',
  marginY: '1rem',
}

export const Strong = styled.strong`
  font-weight: bold;
  ${space}
  ${typography}
  ${color}
`

export const Title = styled.h1`
  ${space}
  ${typography}
  ${color}
`

Title.defaultProps = {
  color: colors.ink.black,
  fontSize: '2rem',
  fontWeight: '400',
  marginTop: '3rem',
  marginBottom: '2.5rem',
}
