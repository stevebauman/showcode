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
          resize: 'ew-resize',
        },
        colors: {
          ash: '#131313',
        }
      },
    },
}