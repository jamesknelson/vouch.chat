import { rgba } from 'polished'
import styled from 'styled-components/macro'
import { colors, dimensions, radii, shadows } from 'theme'

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
`

Card.defaultProps = {
  borders: [true, true, true, true],
  radius: 'small',
}

export const CardHeader = styled.header`
  background-color: ${colors.structure.bg};
  border-bottom: 1px solid ${colors.structure.divider};
  box-shadow: 0 0 12px 1px ${rgba(colors.structure.wash, 0.66)};
  height: ${dimensions.bar};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  position: sticky;
  top: 0;
  z-index: 10;
`

export default Card
