import styled from 'styled-components/macro'
import { border, layout, space } from 'styled-system'

import { colors, radii, shadows } from 'theme'

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
  ${border};
  ${layout};
  ${space};
`

Card.defaultProps = {
  borders: [true, true, true, true],
  radius: 'small',
}

export default Card
