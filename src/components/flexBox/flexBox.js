import styled from 'styled-components/macro'

import { mediaDependentProp, spacing } from 'utils/cssHelpers'

const FlexBox = styled.div`
  display: flex;
  ${spacing};
  ${mediaDependentProp('alignItems', {
    defaultValue: 'center',
    cssProp: 'align-items',
  })}
  ${mediaDependentProp('flexDirection', {
    defaultValue: 'row',
    cssProp: 'flex-direction',
  })}
  ${mediaDependentProp('justifyContent', {
    defaultValue: 'center',
    cssProp: 'justify-content',
  })}
`

export default FlexBox
