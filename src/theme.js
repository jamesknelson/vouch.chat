import { rgba } from 'polished'
import { css } from 'styled-components/macro'

export const breakpoints = {
  mediumPhonePlus: 360,
  tabletPlus: 768,
  laptopPlus: 1100,
  widescreenPlus: 1240,
}

export const colors = {
  structure: {
    bg: '#FFFFFF',
    wash: '#F5F7F9',
    border: '#ECEEF5',
    divider: '#F6F7F8',
  },

  ink: {
    black: '#102030',
    mid: '#606672',
    light: '#d8dbde',
    wash: '#F4F8FF',
  },

  control: {
    bg: {
      default: '#FBFCFF',
      warning: '#FFFBFD',
      highlight: rgba('#4488dd', 0.05),
    },
    border: {
      default: '#E0E8EC',
      warning: '#c7b7b7',
    },
    icon: {
      default: '#334455',
      empty: '#C8CAD0',
      warning: '#D0C0C0',
    },
  },

  focus: {
    default: rgba('#4488dd', 0.75),
  },

  vouch: {
    default: '#BB1111',
  },

  text: {
    default: '#282A2C',
    secondary: '#384048',
    tertiary: '#607080',
    subHeading: '#9098B0',
    placeholder: '#778899',
    warning: '#733939',
    link: '#102030',
    light: 'rgba(255, 255, 255, 0.93)',
  },
}

export const dimensions = {
  base: '16px',
  bar: '4rem',
  narrowCard: '360px',
  defaultMaxFieldWidth: '460px',
}

export const easings = {
  easeInOut: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
  easeIn: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
  easeOut: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
}

const mediaFactory = query => (...args) => css`
  @media screen and ${query} {
    ${css.apply(null, args)}
  }
`

export const mediaQueries = {
  smallPhoneOnly: `(max-width: ${breakpoints.mediumPhonePlus - 1}px)`,
  phoneOnly: `(max-width: ${breakpoints.tabletPlus - 1}px)`,
  mediumPhonePlus: `(min-width: ${breakpoints.mediumPhonePlus}px)`,
  tabletPlus: `(min-width: ${breakpoints.tabletPlus}px)`,
  laptopPlus: `(min-width: ${breakpoints.laptopPlus}px)`,
  widescreenPlus: `(min-width: ${breakpoints.widescreenPlus}px)`,
}
export const media = {
  smallPhoneOnly: mediaFactory(mediaQueries.smallPhoneOnly),
  phoneOnly: mediaFactory(mediaQueries.phoneOnly),
  mediumPhonePlus: mediaFactory(mediaQueries.mediumPhonePlus),
  tabletPlus: mediaFactory(mediaQueries.tabletPlus),
  laptopPlus: mediaFactory(mediaQueries.laptopPlus),
  widescreenPlus: mediaFactory(mediaQueries.widescreenPlus),
}

export const radii = {
  small: '4px',
  medium: '8px',
  large: '16px',
}

export const shadows = {
  card: (color = 'black') =>
    `0 0 4px 2px ${rgba(color, 0.01)}, 0 0 2px 0px ${rgba(color, 0.02)}`,
  raisedCard: (color = 'black') => `0 0 6px 1px ${rgba(0, 0, 0, 0.05)},
    0 0 8px 1px ${rgba(0, 0, 0, 0.02)};`,
  section: (color = colors.structure.wash) =>
    `0 0 15px 1px ${rgba(color, 0.88)},
  0 0 10px 2px ${rgba(color, 0.44)} inset`,
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
  {
    color,
    padding = '0px',
    horizontalPadding,
    verticalPadding,
    radius = radii.medium,
  } = {},
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
      transition: box-shadow 250ms ${easings.easeOut};
      top: calc(0px - ${verticalPadding || padding});
      left: calc(0px - ${horizontalPadding || padding});
      right: calc(0px - ${horizontalPadding || padding});
      bottom: calc(0px - ${verticalPadding || padding});
      border-radius: ${radius};
      position: absolute;
      display: block;
    }
    :hover${selector} {
      box-shadow: ${shadows.focus(colors.ink.light)};
    }
    :focus${selector} {
      box-shadow: ${shadows.focus(color)};
    }
  `
}
