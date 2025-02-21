const { root } = require('postcss-selector-parser');

module.exports = {
    syntax: 'postcss-scss', // Specify the SCSS parser
    plugins: [
      require('postcss-import')(),
      require('@unocss/postcss')(),
      require('./postcss-plugin-prefix-selector')({
        prefix: '.tw',
        includeFiles: ['app.css'],
      }),
      require('./postcss-plugin-no-tw-conflict')({
        twSelector: '.tw',
        excludeFiles: ['app.css'],
      }),
      require('./postcss-rem-to-pixel')({
        rootValue: 10,
        ignoreFiles: ['app.css'],
        propList: ['*'],
        mediaQuery: false,
        unitPrecision: 2,
      }),
      require('autoprefixer')(),
      require('postcss-nested')(),
    ]
  }
  