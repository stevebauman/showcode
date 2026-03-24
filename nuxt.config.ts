export default defineNuxtConfig({
    ssr: false,

    compatibilityDate: '2025-03-01',

    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
    ],

    runtimeConfig: {
        public: {
            isDistributing: true,
            isDesktop: process.env.IS_DESKTOP === 'true',
            platform: {
                windows: process.platform === 'win32',
                darwin: process.platform === 'darwin',
                linux: process.platform === 'linux',
            },
        },
    },

    css: [
        '@/assets/css/app.css',
    ],

    app: {
        head: {
            titleTemplate: 'Showcode',
            htmlAttrs: { lang: 'en' },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Create beautiful images of code.' },
            ],
        },
    },
})

