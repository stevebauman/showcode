import autoAnimate from '@formkit/auto-animate';

export default defineNuxtPlugin((nuxtApp) =>
  nuxtApp.vueApp.directive('auto-animate', {
    inserted: function (el, binding) {
        autoAnimate(el, binding.value);
    },
  })
);