import { rgba } from 'polished'
import { css } from 'styled-components/macro'

// styled-system expects breakpoints to be an array, but we're sticking to
// named breakpoints as it's easier to read.
export const breakpoints = []

breakpoints.mediumPhonePlus = '360px'
breakpoints.tabletPlus = '768px'
breakpoints.dualColumnPlus = '1100px'

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
      warning: '#FFFDFD',
      issue: '#FFFDFD',
      highlight: rgba('#4488dd', 0.05),
    },
    border: {
      default: '#E0E8EC',
      warning: '#c7c0c0',
      issue: '#c7c0c0',
    },
    icon: {
      default: '#334455',
      empty: '#C8CAD0',
      warning: '#D0C0C0',
      issue: '#D0C0C0',
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
    issue: '#4e3e3e',
    warning: '#4e3e3e',
    success: '#113322',
    link: '#102030',
    light: 'rgba(255, 255, 255, 0.93)',
  },
}

export const dimensions = {
  base: '16px',
  bar: '4rem',
  defaultMaxFieldWidth: '28rem',
  largeCardWidth: '48rem',
  smallCardWidth: '24rem',
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
  smallPhoneOnly: `(max-width: calc(${breakpoints.mediumPhonePlus} - 1px))`,
  phoneOnly: `(max-width: calc(${breakpoints.tabletPlus} - 1px))`,
  mediumPhonePlus: `(min-width: ${breakpoints.mediumPhonePlus})`,
  tabletPlus: `(min-width: ${breakpoints.tabletPlus})`,
  dualColumnPlus: `(min-width: ${breakpoints.dualColumnPlus})`,
}
export const media = {
  smallPhoneOnly: mediaFactory(mediaQueries.smallPhoneOnly),
  phoneOnly: mediaFactory(mediaQueries.phoneOnly),
  mediumPhonePlus: mediaFactory(mediaQueries.mediumPhonePlus),
  tabletPlus: mediaFactory(mediaQueries.tabletPlus),
  laptopPdualColumnPluslus: mediaFactory(mediaQueries.dualColumnPlus),
}

export const messages = {
  dirty: {
    color: colors.text.tertiary,
  },
  issue: {
    color: '#4e3e3e',
  },
  success: {
    color: colors.text.success,
  },
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

export default {
  breakpoints,
  colors,
  dimensions,
  easings,
  messages,
  radii,
}
