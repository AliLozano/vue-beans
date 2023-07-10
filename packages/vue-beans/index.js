'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-beans.cjs.prod.js')
} else {
  module.exports = require('./dist/vue-beans.cjs.js')
}
