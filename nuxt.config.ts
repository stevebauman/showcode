export default defineNuxtConfig({
    ssr: false,

    compatibilityDate: '2026-03-25',

    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'shadcn-nuxt',
    ],

    shadcn: {
        prefix: '',
        componentDir: './app/components/ui',
    },

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
        '~/assets/css/app.css',
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
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
            ],
        },
    },
})

