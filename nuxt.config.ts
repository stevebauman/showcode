export default defineNuxtConfig({
    ssr: true,

    compatibilityDate: '2026-03-25',

    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'shadcn-nuxt',
        '@vite-pwa/nuxt',
        'nuxt-og-image',
    ],

    site: {
        url: 'https://showcode.app',
        name: 'Showcode',
    },

    routeRules: {
        '/': { ssr: false, ogImage: { component: 'Default' } },
        '/generator': { ssr: false, ogImage: { component: 'Default' } },
        '/download': { prerender: true },
    },

    ogImage: {
        defaults: {
            component: 'Default',
        },
    },

    nitro: {
        externals: {
            inline: ['lodash', '@panzoom/panzoom'],
        },
    },

    pwa: {
        injectRegister: false,
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
        manifest: {
            id: '/',
            start_url: '/',
            scope: '/',
            name: 'Showcode',
            short_name: 'Showcode',
            description: 'Create beautiful images of code.',
            theme_color: '#09090b',
            background_color: '#09090b',
            display: 'standalone',
            icons: [
                {
                    src: '/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                },
            ],
        },
        workbox: {
            skipWaiting: true,
            clientsClaim: true,
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
            globIgnores: ['**/*.worker-*.js'],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            runtimeCaching: [
                {
                    urlPattern: /\.worker.*\.js$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'worker-cache',
                        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
                    },
                },
            ],
        },
        devOptions: {
            enabled: false,
        },
    },

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
                { rel: 'manifest', href: '/manifest.webmanifest' },
            ],

        },
    },
})

