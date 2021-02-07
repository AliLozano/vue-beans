'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/vite-plugin.cjs.prod')
} else {
    module.exports = require('./dist/vite-plugin.cjs')
}