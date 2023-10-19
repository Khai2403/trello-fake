// nuxt.config.ts
// import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  modules: [
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    // The private keys which are only available server-side
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    // Keys within public are also exposed client-side
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    }
  },
  app: {
    head: {
      title: 'Trello',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          charset: 'utf8',
        },
      ],
      link: [{rel: 'icon', type: 'image/png', href: '/logo-head.png'}]
    }
  },
})
