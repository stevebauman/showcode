const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const path = require('path');

const isDesktop = process.env.IS_DESKTOP === 'true';

module.exports = {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    loadingIndicator: path.join(__dirname, 'assets/loading.html'),

    publicRuntimeConfig: {
        isDistributing: true,
        isDesktop: isDesktop,
        platform: {
            windows: process.platform === 'win32',
            darwin: process.platform === 'darwin',
            linux: process.platform === 'linux',
        },
    },

    // Global page headers: https://go.nuxtjs.dev/config-head
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

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['@/assets/css/app.css', ...(isDesktop ? ['@/assets/css/desktop.css'] : [])],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        path.join(__dirname, 'plugins/shiki'),
        path.join(__dirname, 'plugins/queue'),
        path.join(__dirname, 'plugins/events'),
        path.join(__dirname, 'plugins/ipc-fake'),
        path.join(__dirname, 'plugins/v-tooltip'),
        path.join(__dirname, 'plugins/vue-tailwind'),
        path.join(__dirname, 'plugins/auto-animate'),
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: ['@nuxt/postcss8', '@nuxtjs/composition-api/module', '@pinia/nuxt'],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: ['@nuxtjs/pwa', '@nuxt/content'],

    content: {
        markdown: {
            prism: {
                theme: false,
            },
        },
    },

    pwa: {
        manifest: {
            name: 'Showcode',
            short_name: 'Showcode',
            description: 'Generate beautiful images of code.',
            useWebmanifestExtension: false,
        },
        workbox: {
            enabled: true,
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extend(config) {
            config.plugins.push(new MonacoWebpackPlugin());
        },

        babel: {
            plugins: [['@babel/plugin-proposal-private-property-in-object', { loose: true }]],
        },

        postcss: {
            plugins: {
                'postcss-import': {},
                'tailwindcss/nesting': {},
                tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
                'postcss-hexrgba': {},
                autoprefixer: {},
            },
        },
    },
};
