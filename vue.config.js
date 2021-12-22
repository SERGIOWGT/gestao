const { GenerateSW } = require("workbox-webpack-plugin");

process.env.VUE_APP_TOKEN_SISTEMA='ebe4c237-f13d-11eb-a054-566fe1410274'
process.env.VUE_APP_API_SERVICE_URL='https://api.homolog.painelsaude.com.br/api/'

process.env.VUE_APP_SSO_SERVICE_URL='https://sso.homolog.painelsaude.com.br/api/'

//process.env.VUE_APP_API_SERVICE_URL='https://localhost:44308/api/'
//baseURL: 'https://sso.painelsaude.com.br/api/'
//baseURL: 'http://localhost:56486/api/'

module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/vuejs-pwa/" : "",

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
