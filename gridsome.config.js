const tailwindcss = require("tailwindcss");

module.exports = {
  siteName: 'Showcode',
  titleTemplate: `%s | Showcode`,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          tailwindcss
        ],
      },
    },
  },
  plugins: [
    {
      use: "gridsome-plugin-tailwindcss",

      options: {
        tailwindConfig: './tailwind.config.js',
        presetEnvConfig: {},
        shouldImport: false,
        shouldTimeTravel: false
      }
    },
  ]
}
