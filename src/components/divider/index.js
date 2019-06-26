import styled from 'styled-components/macro'
import { colors } from 'theme'

export const Divider = styled.hr`
  height: 1px;
  border: 0;
  background-color: ${colors.structure.divider};
  margin: 2rem;
`

export default Divider
