const colors = require('tailwindcss/colors');

module.exports = {
  plugins: [
    require('@tailwindcss/forms')
  ],
  purge: [
    './components/**/*.vue',
    'node_modules/vue-tailwind/dist/*.js'
  ],
  theme: {
    extend: {
      cursor: {
        'resize-width': 'ew-resize',
        'resize-height': 'ns-resize',
      },
      colors: {
        sky: colors.sky,
        teal: colors.teal,
        rose: colors.rose,
        violet: colors.violet,
      }
    },
  },
}