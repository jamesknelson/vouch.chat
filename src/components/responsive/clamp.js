import styled from 'styled-components/macro'
import { layout, space } from 'styled-system'

export const Clamp = styled.div`
  ${space}
  ${layout}
`

Clamp.defaultProps = {
  marginY: '1rem',
  marginX: 'auto',
  width: 'calc(100% - 2rem)',
  maxWidth: '320px',
  position: 'relative',
}
