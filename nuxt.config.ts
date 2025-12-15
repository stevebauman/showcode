const isDesktop = process.env.IS_DESKTOP === 'true';

export default defineNuxtConfig({
    // Disable server-side rendering
    ssr: false,

    // Nuxt 3 uses Vite by default, no need for target: 'static'
    // For static generation, use `nuxt generate`

    runtimeConfig: {
        public: {
            isDistributing: true,
            isDesktop: isDesktop,
            platform: {
                windows: process.platform === 'win32',
                darwin: process.platform === 'darwin',
                linux: process.platform === 'linux',
            },
        },
    },

    app: {
        head: {
            titleTemplate: 'Showcode',
            htmlAttrs: { lang: 'en' },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Create beautiful images of code.' },

                { name: 'og:url', content: 'https://showcode.app' },
                { name: 'og:type', content: 'website' },
                { name: 'og:title', content: 'Showcode' },
                { name: 'og:description', content: 'Create beautiful images of code.' },
                { name: 'og:image', content: 'https://showcode.app/og_image.png' },

                { name: 'twitter:domain', content: 'showcode.app' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:description', content: 'Create beautiful images of code.' },
                { name: 'twitter:title', content: 'Showcode' },
                { name: 'twitter:image', content: 'https://showcode.app/twitter_summary_card.png' },
                { name: 'twitter:site', content: 'https://showcode.app' },
                { name: 'twitter:creator', content: '@ste_bau' },

                { name: 'format-detection', content: 'telephone=no' },
                { name: 'msapplication-TileColor', content: '#da532c' },
                { name: 'theme-color', content: '#ffffff' },
            ],
            link: [
                {
                    rel: 'apple-touch-icon',
                    type: 'image/png',
                    sizes: '180x180',
                    href: '/apple-touch-icon.png',
                },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
            ],
            script: [],
        },
    },

    // Global CSS
    css: ['@/assets/css/app.css', ...(isDesktop ? ['@/assets/css/desktop.css'] : [])],

    // Components configuration - exclude index.js files from auto-import
    components: {
        dirs: [
            {
                path: '~/components',
                ignore: ['**/index.js', '**/index.ts'],
            },
        ],
    },

    // Modules
    modules: [
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxt/content',
        '@vite-pwa/nuxt',
    ],

    // Content module configuration
    content: {
        markdown: {
            // Prism is replaced by Shiki in Nuxt Content v2
        },
    },

    // Router configuration for desktop (Electron)
    router: isDesktop
        ? {
              options: {
                  hashMode: true,
              },
          }
        : {},

    // PWA configuration
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Showcode',
            short_name: 'Showcode',
            description: 'Generate beautiful images of code.',
            theme_color: '#ffffff',
            icons: [
                {
                    src: '/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
            // Monaco editor is large, increase the limit to 5MB
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        client: {
            installPrompt: true,
        },
        devOptions: {
            enabled: !isDesktop,
        },
    },

    // PostCSS configuration
    postcss: {
        plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            'postcss-hexrgba': {},
            autoprefixer: {},
        },
    },

    // Vite configuration
    vite: {
        // Monaco editor configuration for Vite
        optimizeDeps: {
            include: ['monaco-editor'],
        },
    },

    // TypeScript configuration
    typescript: {
        shim: false,
    },

    // Compatibility date
    compatibilityDate: '2024-11-01',
});

