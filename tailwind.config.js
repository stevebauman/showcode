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
        colors: {
          ash: '#131313',
        }
      },
    },
}