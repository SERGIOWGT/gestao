const { GenerateSW } = require("workbox-webpack-plugin");

//process.env.VUE_APP_API_SERVICE_URL='https://localhost:44308/api/'
//baseURL: 'https://sso.painelsaude.com.br/api/'
//baseURL: 'http://localhost:56486/api/'

module.exports = {
  publicPath: process.env.NODE_ENV === "devselopment" ? "/vuejs-pwa/" : "",

  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Painel Saúde - Gestão',
    },
  },
  configureWebpack: {
    plugins: [
        new GenerateSW(),
      ]
  },
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    'vuetify'
  ]
}
