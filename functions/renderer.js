// This module's source is placed into a `renderer.tgz` file as part of the
// pre-deploy script, so that it can be installed into node_modules when
// running in the cloud.
//
// However, when running locally, we can just include the actual file from
// its original location.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('app').default
} else {
  try {
    module.exports = require('../build/node').default
  } catch (error) {
    // The development server includes its own renderer, so we probably
    // won't use this anyway.
    module.exports = () => {
      throw error
    }
  }
}
