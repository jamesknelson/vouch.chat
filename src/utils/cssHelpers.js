import { css } from 'styled-components/macro'
import { mediaQueries } from 'theme'
import addDefaultRemUnits from './addDefaultRemUnits'
import ensureWrappedWithArray from './ensureWrappedWithArray'

const processValue = value =>
  value &&
  ensureWrappedWithArray(value)
    .map(addDefaultRemUnits)
    .join(' ')

const buildAttributes = (cssProps, transform, value) => {
  return cssProps
    .map(prop => [prop, ': ', transform(value), ';'].join(''))
    .join('')
}

export function mediaDependentProp(
  propName,
  {
    defaultValue = undefined,
    cssProp = null,
    cssProps = null,
    transform = processValue,
    aliasProps = [],
  } = {},
) {
  let propNames = [propName].concat(ensureWrappedWithArray(aliasProps))

  if (process.env.NODE_ENV !== 'production') {
    if (cssProp && cssProps) {
      console.warn(
        'mediaDependentProp() received both `cssProp` and `cssProps` options. Merge both options into one to silence this message.',
      )
    }
  }

  cssProps = ensureWrappedWithArray(cssProps || cssProp || propName)

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
      ? buildAttributes(cssProps, transform, value.default)
      : ''
    delete value.default
    values += Object.entries(value)
      .map(
        ([mediaQuery, value]) => `
          @media screen and ${mediaQueries[mediaQuery] || mediaQuery} {
            ${buildAttributes(cssProps, transform, value)}
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
