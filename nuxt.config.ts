const isDesktop = process.env.IS_DESKTOP === 'true';

export default defineNuxtConfig({
    compatibilityDate: '2026-03-22',
    ssr: false,
    devtools: {
        enabled: false,
    },

    css: ['@/assets/css/app.css', ...(isDesktop ? ['@/assets/css/desktop.css'] : [])],

    modules: ['@pinia/nuxt', '@nuxt/content', 'floating-vue/nuxt'],

    runtimeConfig: {
        public: {
            isDistributing: true,
            isDesktop,
            platform: {
                windows: process.platform === 'win32',
                darwin: process.platform === 'darwin',
                linux: process.platform === 'linux',
            },
        },
    },

    app: {
        baseURL: isDesktop ? './' : '/',
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
        },
    },

    router: {
        options: {
            hashMode: isDesktop,
        },
    },
    build: {
        transpile: ['monaco-editor'],
    },

    postcss: {
        plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            'postcss-hexrgba': {},
            autoprefixer: {},
        },
    },

    vite: {
        define: {
            global: 'globalThis',
        },
        optimizeDeps: {
            include: [
                'lodash',
                'vuedraggable',
                '@vueuse/core',
                'perfect-scrollbar',
                'uuid',
                'idb-keyval',
                'file-select-dialog',
                'lucide-vue-next',
                'downloadjs',
                'split.js',
                'fuse.js',
                'detect-browser',
                'html-to-image',
                'interactjs',
                'chroma-js',
                'postcss',
                'vue-advanced-cropper',
                'hex-alpha',
                '@panzoom/panzoom',
            ],
        },
    },
});
