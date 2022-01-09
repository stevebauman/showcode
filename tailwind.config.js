const colors = require('tailwindcss/colors');

module.exports = {
    plugins: [
      require('@tailwindcss/forms')
    ],
    purge: [
      './data/*.js',
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
          orange: colors.orange,
          amber: colors.amber,
          lime: colors.lime,
          emerald: colors.emerald,
          teal: colors.teal,
          cyan: colors.cyan,
          sky: colors.sky,
          violet: colors.violet,
          purple: colors.purple,
          fuchsia: colors.fuchsia,
          rose: colors.rose,
          'blue-gray': colors.blueGray,
          'cool-gray': colors.coolGray,
          'true-gray': colors.trueGray,
          'warm-gray': colors.warmGray,
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
        },
        backgroundImage: {
          conic: 'conic-gradient(var(--tw-gradient-stops))',
          'conic-to-t': 'conic-gradient(at top, var(--tw-gradient-stops))',
          'conic-to-b': 'conic-gradient(at bottom, var(--tw-gradient-stops))',
          'conic-to-l': 'conic-gradient(at left, var(--tw-gradient-stops))',
          'conic-to-r': 'conic-gradient(at right, var(--tw-gradient-stops))',
          'conic-to-tl': 'conic-gradient(at top left, var(--tw-gradient-stops))',
          'conic-to-tr': 'conic-gradient(at top right, var(--tw-gradient-stops))',
          'conic-to-bl':
            'conic-gradient(at bottom left, var(--tw-gradient-stops))',
          'conic-to-br':
            'conic-gradient(at bottom right, var(--tw-gradient-stops))',
          radial: 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
          'radial-at-t':
            'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
          'radial-at-b':
            'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
          'radial-at-l':
            'radial-gradient(ellipse at left, var(--tw-gradient-stops))',
          'radial-at-r':
            'radial-gradient(ellipse at right, var(--tw-gradient-stops))',
          'radial-at-tl':
            'radial-gradient(ellipse at top left, var(--tw-gradient-stops))',
          'radial-at-tr':
            'radial-gradient(ellipse at top right, var(--tw-gradient-stops))',
          'radial-at-bl':
            'radial-gradient(ellipse at bottom left, var(--tw-gradient-stops))',
          'radial-at-br':
            'radial-gradient(ellipse at bottom right, var(--tw-gradient-stops))'
        },
        rotate: {
          135: '135deg',
          '-135': '-135deg'
        },
        scale: {
          '200': '2',
        },
      },
    },
    variants: {
      extend: {
        textColor: ['group-focus'],
      },
    },
}