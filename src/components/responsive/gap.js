import styled from 'styled-components/macro'
import { system } from 'styled-system'

import addDefaultRemUnits from 'utils/addDefaultRemUnits'

const config = {
  size: {
    property: 'height',
    transform: addDefaultRemUnits,
  },
}

export const Gap = styled.div`
  ${system(config)}
  width: 100%;
`

Gap.defaultProps = {
  size: 1,
}
