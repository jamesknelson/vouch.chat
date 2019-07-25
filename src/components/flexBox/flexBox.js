import styled from 'styled-components/macro'

import { mediaDependentProp, spacing } from 'utils/cssHelpers'

const FlexBox = styled.div`
  display: flex;
  ${spacing};
  ${mediaDependentProp('align-items', {
    defaultValue: 'center',
    propNames: 'alignItems',
  })}
  ${mediaDependentProp('flex-direction', {
    defaultValue: 'row',
    propNames: 'flexDirection',
  })}
  ${mediaDependentProp('justify-content', {
    defaultValue: 'center',
    propNames: 'justifyContent',
  })}
`

export default FlexBox
