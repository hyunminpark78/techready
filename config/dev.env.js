const merge = require('webpack-merge')
const prodEnv = require('./stg.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})
