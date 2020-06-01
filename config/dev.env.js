'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
baseUrl: '"http://192.168.10.5:8190"',  //不能去掉里面的""
//baseUrl: '"http://192.168.10.66:8190"',  //不能去掉里面的""
  
})