import { css } from 'styled-components/macro'

/**
 * Make an element readable by screenreaders, but invisible otherwise.
 * Useful for adding <label> elements for form inputs whose purpose is
 * visually obvious.
 * From Bootstrap: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
 */
const srOnly = css`
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

export default srOnly
