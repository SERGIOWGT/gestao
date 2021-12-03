const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/vuejs-pwa/" : "",

  configureWebpack: {
    plugins: [new GenerateSW()]
  },
  
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map'
  },
  
  transpileDependencies: [
    'vuetify'
  ]
}
