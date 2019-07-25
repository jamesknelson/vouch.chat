import styled from 'styled-components/macro'

import { colors, radii, shadows } from 'theme'
import { spacing } from 'utils/cssHelpers'

const Card = styled.div`
  background-color: ${colors.structure.bg};
  border-style: solid;
  border-color: ${colors.structure.border};
  border-width: ${props =>
    (Array.isArray(props.borders) ? props.borders : [props.borders]).map(x =>
      !!x ? ' 1px' : ' 0',
    )};
  box-shadow: ${props =>
    props.raised ? shadows.raisedCard() : shadows.card()};
  border-radius: ${props => radii[props.radius] || props.radius || 0};
  position: relative;
  ${spacing};
`

Card.defaultProps = {
  borders: [true, true, true, true],
  radius: 'small',
}

export default Card
