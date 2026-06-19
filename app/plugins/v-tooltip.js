import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(FloatingVue, {
        themes: {
            tooltip: {
                delay: {
                    show: 500,
                    hide: 0,
                },
            },
        },
    });
});
