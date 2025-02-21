const { root } = require('postcss-selector-parser');

module.exports = {
    syntax: 'postcss-scss', // Specify the SCSS parser
    plugins: [
      require('postcss-import')(),
      require('@unocss/postcss')(),
      require('postcss-prefix-selector')({
        prefix: '.tw',
        skipGlobalSelectors: true,
        includeFiles: ['app.css'],
      }),
      require('./postcss-plugin-no-tw-conflict')({
        twSelector: '.tw',
        excludeFiles: ['app.css'],
      }),
      require('autoprefixer')(),
      require('postcss-nested')(),
    ]
  }
  