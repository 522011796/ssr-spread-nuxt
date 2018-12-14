const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env:{
    server:'dev'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#2db7f5' },
  //loading: '~/components/loading.vue',

  /*
  ** Global CSS
  */
  css: [
    '~assets/font-awesome/css/font-awesome.min.css',
    '~assets/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~plugins/iview', ssr: true},
    '~plugins/i18n',
    '~plugins/moment',
    '~plugins/validation',
    '~plugins/utils',
    {src:'~plugins/vue-quill.js', ssr: false}
    /*{src: '~plugins/axios', ssr: true}*/
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true,
  },
  proxy: [
    [
      '/proxy',
      {
        target: 'https://cnodejs.org/api/v1', // api主机
        pathRewrite: { '^/proxy' : '/' }
      }
    ],
    [
      '/obj',
      {
        target: 'https://ricky-img.oss-cn-shenzhen.aliyuncs.com', // api主机
        pathRewrite: { '^/obj' : '/' }
      }
    ],
    [
      '/upload',
      {
        target: 'http://jsonplaceholder.typicode.com/posts', // api主机
        pathRewrite: { '^/upload' : '/' }
      }
    ]
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    vendor: ['external_library','axios','js-cookie','i18n','moment','utils','babel-polyfill','event-source-polyfill'],
    extend(config, ctx) {

    }
  },
  router: {
    middleware: ['i18n','browser','stats','auth']
  }
}
