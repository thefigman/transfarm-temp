const googleApiKey = 'AIzaSyCCg1u2uqHXsdSMH0ox6U3snWmNMDt2ul4'

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: "TEST TITLE",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }, {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,900&display=swap'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: ['./assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    './plugins/firebaseInit.js',
    './plugins/vuetify.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    [
      'nuxt-fontawesome', {
        imports: [{
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      }
    ],
    ['nuxt-gmaps', {
      key: googleApiKey,
      //you can use libraries: ['places']
    }]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  manifest: {
    name: 'Nuxt.js PWA survival store',
    short_name: 'Nuxt.js PWA',
    lang: 'en',
    display: 'standalone',
    start_url: '/test'
  },
  // workbox: {
  //   runtimeCaching: [{
  //       urlPattern: 'https://fonts.googleapis.com/.*',
  //       handler: 'cacheFirst',
  //       method: 'GET',
  //       strategyOptions: {
  //         cacheableResponse: {
  //           statuses: [0, 200]
  //         }
  //       }
  //     },
  //     {
  //       urlPattern: 'https://fonts.gstatic.com/.*',
  //       handler: 'cacheFirst',
  //       method: 'GET',
  //       strategyOptions: {
  //         cacheableResponse: {
  //           statuses: [0, 200]
  //         }
  //       }
  //     }
  //   ]
  // }
  server: {
    host: "0.0.0.0",
    port: 3000
  }
}