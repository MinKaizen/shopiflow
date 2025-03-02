import postcssImport from 'postcss-import';
import postcssPrefixSelector from 'postcss-prefix-selector';
import noTwConflict from './postcss-plugin-no-tw-conflict.mjs';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import postcssUrl from 'postcss-url';

export default {
  plugins: [
    postcssImport(),
    postcssUrl({
      url: 'rebase',
    }),
    postcssPrefixSelector({
      prefix: '.tw',
      skipGlobalSelectors: true,
      includeFiles: ['tailwind.css'],
    }),
    noTwConflict({
      twSelector: '.tw',
      excludeFiles: ['tailwind.css'],
    }),
    autoprefixer(),
    postcssNested(),
  ],
};
