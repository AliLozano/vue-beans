'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/vue-beans.cjs.prod')
} else {
    module.exports = require('./dist/vue-beans.cjs')
}