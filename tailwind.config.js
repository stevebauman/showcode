const colors = require('tailwindcss/colors');

module.exports = {
    plugins: [
      require('@tailwindcss/forms')
    ],
    purge: [
      './pages/**/*.vue',
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
          ui: {
            focus: "var(--color-ui-violet-500)",
            "gray-50": "var(--color-ui-gray-50)",
            "gray-100": "var(--color-ui-gray-100)",
            "gray-200": "var(--color-ui-gray-200)",
            "gray-300": "var(--color-ui-gray-300)",
            "gray-400": "var(--color-ui-gray-400)",
            "gray-500": "var(--color-ui-gray-500)",
            "gray-600": "var(--color-ui-gray-600)",
            "gray-700": "var(--color-ui-gray-700)",
            "gray-800": "var(--color-ui-gray-800)",
            "gray-900": "var(--color-ui-gray-900)",
            "violet-500": "var(--color-ui-violet-500)",
            "violet-600": "var(--color-ui-violet-600)",
            "violet-900": "var(--color-ui-violet-900)",
          },
        }
      },
    },
    variants: {
      extend: {
        textColor: ['group-focus'],
      },
    },
}