/**
 * Adapted from https://github.com/jesstech/postcss-rem-to-pixel/blob/master/index.js
 */

'use strict';

const remRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rem/g;

const defaults = {
  rootValue: 16,
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  replace: true,
  mediaQuery: false,
  minRemValue: 0,
  includeFiles: [],
  ignoreFiles: [],
};

const remToPixelPlugin = (options = {}) => {
  const opts = { ...defaults, ...options };
  const includeFiles = [].concat(opts.includeFiles);
  const ignoreFiles = [].concat(opts.ignoreFiles);
  
  return {
    postcssPlugin: 'postcss-rem-to-pixel',
    prepare(result) {
      const root = result.root;
      const file = root.source.input.file;

      console.log('REM TO PIX..')
      
      // Skip ignored or non-included files
      if (ignoreFiles.length && file && isFileInArray(file, ignoreFiles)) {
        return;
      } else if (includeFiles.length && file && !isFileInArray(file, includeFiles)) {
        return;
      }

      console.log('rem Processing file:', file);
      
      return {
        Declaration(decl) {
          if (decl.value.indexOf('rem') === -1) return;
          if (!satisfyPropList(opts.propList, decl.prop)) return;
          if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector)) return;
          
          const value = decl.value.replace(remRegex, createRemReplace(opts.rootValue, opts.unitPrecision, opts.minRemValue));
          if (opts.replace) {
            decl.value = value;
          } else {
            decl.parent.insertAfter(decl, decl.clone({ value }));
          }
        },
        AtRule(atRule) {
          if (opts.mediaQuery && atRule.name === 'media' && atRule.params.includes('rem')) {
            atRule.params = atRule.params.replace(remRegex, createRemReplace(opts.rootValue, opts.unitPrecision, opts.minRemValue));
          }
        }
      };
    }
  };
};

function createRemReplace(rootValue, unitPrecision, minRemValue) {
  return (m, $1) => {
    if (!$1) return m;
    const rems = parseFloat($1);
    if (rems < minRemValue) return m;
    return `${toFixed(rems * rootValue, unitPrecision)}px`;
  };
}

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision);
  return Math.round(number * multiplier) / multiplier;
}

function satisfyPropList(propList, prop) {
  return propList.includes('*') || propList.some(match => prop.includes(match));
}

function blacklistedSelector(blacklist, selector) {
  return blacklist.some(rule => (typeof rule === 'string' ? selector.includes(rule) : rule.test(selector)));
}

function isFileInArray(file, arr) {
  return arr.some(rule => (rule instanceof RegExp ? rule.test(file) : file.includes(rule)));
}

remToPixelPlugin.postcss = true;

module.exports = remToPixelPlugin;
