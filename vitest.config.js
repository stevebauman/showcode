import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
    test: {
        exclude: ['tests/e2e/**', 'node_modules/**'],
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                mock: {
                    intersectionObserver: true,
                    indexedDb: true,
                },
            },
        },
    },
});

