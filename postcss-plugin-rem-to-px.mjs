/**
 * Code is adapted from https://github.com/jesstech/postcss-rem-to-pixel/
 * We just wrapped their logic in `Once()` and provided support for the
 * `includeFiles` and `excludeFiles` options
 */
import path from 'path'

const filterPropList = {
  exact: function (list) {
    return list.filter(function (m) {
      return m.match(/^[^\*\!]+$/);
    });
  },
  contain: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^\*.+\*$/);
      })
      .map(function (m) {
        return m.substr(1, m.length - 2);
      });
  },
  endWith: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^\*[^\*]+$/);
      })
      .map(function (m) {
        return m.substr(1);
      });
  },
  startWith: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^[^\*\!]+\*$/);
      })
      .map(function (m) {
        return m.substr(0, m.length - 1);
      });
  },
  notExact: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^\![^\*].*$/);
      })
      .map(function (m) {
        return m.substr(1);
      });
  },
  notContain: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^\!\*.+\*$/);
      })
      .map(function (m) {
        return m.substr(2, m.length - 3);
      });
  },
  notEndWith: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^\!\*[^\*]+$/);
      })
      .map(function (m) {
        return m.substr(2);
      });
  },
  notStartWith: function (list) {
    return list
      .filter(function (m) {
        return m.match(/^\![^\*]+\*$/);
      })
      .map(function (m) {
        return m.substr(1, m.length - 2);
      });
  },
};

const remRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rem/g;

const defaults = {
  rootValue: 16,
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  replace: true,
  mediaQuery: false,
  /**@type {string[]} */
  includeFiles: [],
  /**@type {string[]} */
  excludeFiles: [],
  minRemValue: 0,
};

const createRemReplace = (rootValue, unitPrecision, minRemValue) => (m, $1) => {
  if (!$1) return m;
  const rems = parseFloat($1);
  if (rems < minRemValue) return m;
  const fixedVal = toFixed(rems * rootValue, unitPrecision);
  return fixedVal === 0 ? '0' : `${fixedVal}px`;
};

const toFixed = (number, precision) => {
  const multiplier = 10 ** (precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
};

const declarationExists = (decls, prop, value) => decls.some((decl) => decl.prop === prop && decl.value === value);

const blacklistedSelector = (blacklist, selector) => {
  if (typeof selector !== 'string') return false;
  return blacklist.some((regex) => (typeof regex === 'string' ? selector.includes(regex) : selector.match(regex)));
};

const createPropListMatcher = (propList) => {
  const hasWild = propList.includes('*');
  const matchAll = hasWild && propList.length === 1;
  const lists = {
    exact: filterPropList.exact(propList),
    contain: filterPropList.contain(propList),
    startWith: filterPropList.startWith(propList),
    endWith: filterPropList.endWith(propList),
    notExact: filterPropList.notExact(propList),
    notContain: filterPropList.notContain(propList),
    notStartWith: filterPropList.notStartWith(propList),
    notEndWith: filterPropList.notEndWith(propList),
  };

  return (prop) => {
    if (matchAll) return true;
    return (hasWild || lists.exact.includes(prop) || lists.contain.some((m) => prop.includes(m)) || lists.startWith.some((m) => prop.startsWith(m)) || lists.endWith.some((m) => prop.endsWith(m))) && !(lists.notExact.includes(prop) || lists.notContain.some((m) => prop.includes(m)) || lists.notStartWith.some((m) => prop.startsWith(m)) || lists.notEndWith.some((m) => prop.endsWith(m)));
  };
};

const remToPxPlugin = (options = {}) => {
  const opts = { ...defaults, ...options };
  const remReplace = createRemReplace(opts.rootValue, opts.unitPrecision, opts.minRemValue);
  const satisfyPropList = createPropListMatcher(opts.propList);
  const declsWalker = (decl) => {
    if (!decl.value.includes('rem')) return;
    if (!satisfyPropList(decl.prop)) return;
    if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector)) return;

    const value = decl.value.replace(remRegex, remReplace);
    if (declarationExists(decl.parent, decl.prop, value)) return;

    if (opts.replace) {
      decl.value = value;
    } else {
      decl.parent.insertAfter(decl, decl.clone({ value }));
    }
  };

  const atRuleWalker = (rule) => {
    if (!rule.params.includes('rem')) return;
    rule.params = rule.params.replace(remRegex, remReplace);
  };

  return {
    postcssPlugin: 'postcss-plugin-rem-to-px',
    Once(root, { result }) {
      const inputFile = result.opts.from ? path.basename(result.opts.from) : '';

      if ((opts.includeFiles.length && !opts.includeFiles.includes(inputFile)) || opts.excludeFiles.includes(inputFile)) {
        console.log(`\n${inputFile}: Skipping...\n`);
        return; // Skip processing
      }
      console.log(`\n${inputFile}: Processing...\n`);
      root.walkDecls(declsWalker);

      if (opts.mediaQuery) {
        root.walkAtRules('media', atRuleWalker);
      }
    },
  };
};

export default remToPxPlugin;
export const postcss = true;
