const tailwindcss = require("tailwindcss");

module.exports = {
  siteName: 'Photocode',
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
