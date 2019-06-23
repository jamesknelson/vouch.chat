import { rgba } from 'polished'
import { css } from 'styled-components/macro'

export const colors = {
  structure: {
    bg: '#FFFFFF',
    wash: '#F5F9FD',
    border: '#EAECF2',
    divider: '#F6F7F8',
  },

  ink: {
    black: '#102030',
    mid: '#334455',
  },

  control: {
    bg: '#FBFDFF',
    highlight: '#F8FAFC',
    border: '#E0E8EC',
    default: '#888',
    icon: '#556688',
  },

  focus: {
    default: rgba('#4488dd', 0.75),
  },

  vouch: {
    default: '#BB1111',
  },

  success: {
    default: '#00B88B',
  },

  text: {
    default: '#282A2C',
    secondary: '#384048',
    tertiary: '#607080',
    placeholder: '#778899',
  },

  warn: {
    default: '#E22F2F',
  },
}

export const dimensions = {
  base: '16px',
  bar: '4rem',
}

export const easings = {
  easeInOut: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
  easeIn: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
  easeOut: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
}

export const media = {
  mediumPhonePlus: (...args) => css`
    @media screen and (min-width: 360px) {
      ${css.apply(null, args)}
    }
  `,
  tabletPlus: (...args) => css`
    @media screen and (min-width: 720px) {
      ${css.apply(null, args)}
    }
  `,
  laptopPlus: (...args) => css`
    @media screen and (min-width: 1100px) {
      ${css.apply(null, args)}
    }
  `,
  widescreenPlus: (...args) => css`
    @media screen and (min-width: 1240px) {
      ${css.apply(null, args)}
    }
  `,
}

export const radii = {
  small: '4px',
  medium: '8px',
  large: '16px',
}

export const shadows = {
  card: (color = 'black') => `0 0 5px 3px ${rgba(color, 0.01)}`,
  raisedCard: (color = 'black') => `0 0 6px 1px ${rgba(0, 0, 0, 0.05)},
    0 0 8px 1px ${rgba(0, 0, 0, 0.02)};`,
  focusHard: (color = colors.focus.default) => `0 0 0 2px ${color}`,
  focusSoft: (color = colors.focus.default) =>
    `0 0 4px 3px ${rgba(color, 0.4)}`,
  focus: color => `${shadows.focusHard(color)}, ${shadows.focusSoft(color)}`,
}

/**
 * Make an element readable by screenreaders, but invisible otherwise.
 * Useful for adding <label> elements for form inputs whose purpose is
 * visually obvious.
 * From Bootstrap: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
 */
export const srOnly = css`
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
`

export const focusRing = (
  selector,
  { color, padding = '0px', horizontalPadding, verticalPadding } = {},
) => {
  if (horizontalPadding === undefined) {
    horizontalPadding = padding.split(/\s/)[1]
  }
  if (verticalPadding === undefined) {
    verticalPadding = padding.split(/\s/)[0]
  }

  return css`
    ${selector} {
      content: ' ';
      transition: box-shadow 200ms ${easings.easeOut};
      top: calc(-1px - ${verticalPadding || padding});
      left: calc(-1px - ${horizontalPadding || padding});
      right: calc(-1px - ${horizontalPadding || padding});
      bottom: calc(-1px - ${verticalPadding || padding});
      border-radius: 9999px;
      position: absolute;
      display: block;
    }
    :focus${selector} {
      box-shadow: ${shadows.focus(color)};
    }
  `
}
