import { css } from 'styled-components/macro'
import { mediaQueries } from 'theme'
import addDefaultRemUnits from './addDefaultRemUnits'
import ensureWrappedWithArray from './ensureWrappedWithArray'

const processValue = value =>
  value &&
  ensureWrappedWithArray(value)
    .map(addDefaultRemUnits)
    .join(' ')

export function mediaDependentProp(
  cssName,
  { defaultValue = undefined, propNames = [] } = {},
) {
  propNames = [cssName].concat(ensureWrappedWithArray(propNames))

  return props => {
    let propName = propNames.find(propName => !!props[propName])
    let value = props[propName] || defaultValue
    if (!value) {
      return ''
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      Array.isArray(value)
    ) {
      value = { default: value }
    }
    let values = value.default
      ? `${cssName}: ${processValue(value.default)};`
      : ``
    delete value.default
    values += Object.entries(value)
      .map(
        ([mediaQuery, value]) => `
          @media screen and ${mediaQueries[mediaQuery] || mediaQuery} {
            ${cssName}: ${processValue(value)};
          }
        `,
      )
      .join(';')
    return values
  }
}

export const spacing = css`
  ${mediaDependentProp('margin')}
  ${mediaDependentProp('padding')}
`
