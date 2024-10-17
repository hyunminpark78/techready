// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

// let target = 'http://stg.5gxcloud.com:8104' // stg 설정값
// let target = 'http://dev.5gxcloud.com:8104' // dev 설정값
let target = 'http://localhost:8104' // local 설정값
let changeOrigin = true // 기본 설정값
try {
  // ../sample_proxy-table.local.json 참조 //
  // 파일이 존재하지 않을때 기본값으로 세팅됨 //
  // const proxyTable = require('../proxy-table.local')
  // target = proxyTable.target
  // changeOrigin = proxyTable.changeOrigin
} catch (e) {
  console.log(e)
}

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: './',
    assetsPublicPath: '/',
    proxyTable: {
      '/cap/v1': {
        // target: 'https://ocp-ops2server-sandbox.dev.opsnow.com',
        target: target,
        changeOrigin: changeOrigin
      },
      '/ocp/v1': {
        target: target,
        changeOrigin: changeOrigin
      },
      '/usag/v1': {
        // target: 'https://ocp-ops2server-sandbox.dev.opsnow.com',
        target: target,
        changeOrigin: changeOrigin
      },
      '/cmm/v1': {
        // target: 'https://ocp-ops2server-sandbox.dev.opsnow.com',
        target: target,
        changeOrigin: changeOrigin
      },
      '/FRESH_DOWNLOAD/*': {
        target: 'https://sktcloudservice.attachments.freshdesk.com',
        changeOrigin: changeOrigin,
        pathRewrite: {'^/FRESH_DOWNLOAD' : ''},
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 6007, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
