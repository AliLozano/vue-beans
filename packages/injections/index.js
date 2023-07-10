'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/injections.cjs.prod.js')
} else {
  module.exports = require('./dist/injections.cjs.js')
}
