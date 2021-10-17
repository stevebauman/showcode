module.exports = {
    plugins: [
      require('@tailwindcss/forms')
    ],
    purge: [
      './src/**/*.vue',
      './src/**/*.js',
      './src/**/*.md',
      './src/**/*.html',
    ],
    theme: {
      extend: {
        cursor: {
          'resize-width': 'ew-resize',
          'resize-height': 'ns-resize',
        },
        colors: {
          ash: '#131313',
        }
      },
    },
}