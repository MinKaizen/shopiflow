const selectorParser = require('postcss-selector-parser');
const path = require('path');

module.exports = (opts = {}) => {
  const defaultTwClasses = [
    'absolute',
    'block',
    'bottom',
    'capitalize',
    'col-span-1',
    'col-span-2',
    'container',
    'content',
    'cursor-not-allowed',
    'cursor-pointer',
    'fixed',
    'flex-1',
    'flex-wrap',
    'flex',
    'focus:outline-none',
    'focus:ring',
    'font-bold',
    'font-light',
    'font-normal',
    'gap-0',
    'gap-1',
    'gap-2',
    'gap-x-4',
    'gap-y-2',
    'grid-cols-1',
    'grid-cols-2',
    'grid',
    'h-auto',
    'h-full',
    'hidden',
    'inline-block',
    'inline',
    'items-center',
    'items-start',
    'justify-between',
    'justify-end',
    'justify-start',
    'leading-normal',
    'leading-tight',
    'left',
    'lowercase',
    'm-0',
    'm-1',
    'm-auto',
    'max-h-full',
    'max-w-full',
    'min-h-0',
    'min-w-0',
    'opacity-0',
    'opacity-100',
    'overflow-auto',
    'overflow-hidden',
    'overflow-scroll',
    'p-0',
    'p-1',
    'pb-0',
    'pl-0',
    'pr-0',
    'pt-0',
    'relative',
    'right',
    'row-span-1',
    'row-span-2',
    'self-end',
    'self-start',
    'sticky',
    'table',
    'text-base',
    'text-lg',
    'text-sm',
    'text-xl',
    'top',
    'tracking-tight',
    'tracking-wide',
    'uppercase',
    'visible',
    'w-auto',
    'w-full',
    'z-0',
    'z-10',
  ];

  const {
    includeFiles = [],
    excludeFiles = [],
    twSelector = '.tw',
    twClasses = defaultTwClasses,
  } = opts;

  const twClassSet = new Set(twClasses);

  return {
    postcssPlugin: 'postcss-no-tw-conflict',
    Once(root, { result }) {
      const inputFile = result.opts.from ? path.basename(result.opts.from) : null;

      if (
        (includeFiles.length && !includeFiles.includes(inputFile)) ||
        excludeFiles.includes(inputFile)
      ) {
        return; // Skip processing
      }

      root.walkRules((rule) => {
        rule.selectors = rule.selectors.map((selector) => {
            try {
                return selectorParser((selectors) => {
                    selectors.walkClasses((node) => {
                        if (twClassSet.has(node.value)) {
                            const parent = node.parent;
                            if (parent) {
                                // Find the last simple selector (i.e., the last class, tag, or ID in the selector)
                                let lastNode = null;
                                parent.each((child) => {
                                    if (child.type === 'class' || child.type === 'tag' || child.type === 'id') {
                                        lastNode = child;
                                    }
                                });
    
                                if (lastNode) {
                                    parent.insertAfter(node, selectorParser.pseudo({ value: `:not(${twSelector}):not(${twSelector} ${node.toString()})` }));
                                }
                            }
                        }
                    });
                }).processSync(selector);
            } catch (error) {
                console.error('Error processing selector:', selector, error);
                return selector;
            }
        });
    });
    }
  };
};

module.exports.postcss = true;
