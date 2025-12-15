import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(FloatingVue, {
        themes: {
            tooltip: {
                distance: 5,
                delay: {
                    show: 200,
                    hide: 0,
                },
            },
        },
    });
});
