const selectorParser = require('postcss-selector-parser');
const path = require('path');

module.exports = (opts = {}) => {
  const defaultTwClasses = [
    "absolute",
    "active",
    "alert",
    "badge",
    "block",
    "bottom",
    "box",
    "btn",
    "button",
    "capitalize",
    "card",
    "checked",
    "col-span-1",
    "col-span-2",
    "col",
    "container",
    "content",
    "cursor-not-allowed",
    "cursor-pointer",
    "disabled",
    "fixed",
    "flex-1",
    "flex-wrap",
    "flex",
    "focus:outline-none",
    "focus:ring",
    "focus",
    "font-bold",
    "font-light",
    "font-normal",
    "form",
    "gap-0",
    "gap-1",
    "gap-2",
    "gap-x-4",
    "gap-y-2",
    "gap",
    "grid-cols-1",
    "grid-cols-2",
    "grid",
    "h-auto",
    "h-full",
    "hidden",
    "hover",
    "inline-block",
    "inline",
    "input",
    "items-center",
    "items-start",
    "justify-between",
    "justify-end",
    "justify-start",
    "label",
    "leading-normal",
    "leading-tight",
    "left",
    "link",
    "lowercase",
    "m-0",
    "m-1",
    "m-auto",
    "max-h-full",
    "max-w-full",
    "min-h-0",
    "min-w-0",
    "opacity-0",
    "opacity-100",
    "overflow-auto",
    "overflow-hidden",
    "overflow-scroll",
    "p-0",
    "p-1",
    "p-auto",
    "pb-0",
    "pl-0",
    "placeholder",
    "pr-0",
    "pt-0",
    "readonly",
    "relative",
    "right",
    "row-span-1",
    "row-span-2",
    "row",
    "self-end",
    "self-start",
    "sticky",
    "table",
    "tag",
    "text-base",
    "text-lg",
    "text-sm",
    "text-xl",
    "text",
    "textarea",
    "top",
    "tracking-tight",
    "tracking-wide",
    "uppercase",
    "visible",
    "w-auto",
    "w-full",
    "wrap",
    "z-0",
    "z-10",
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
                                    const lastSelector = lastNode.toString();
                                    parent.insertAfter(node, selectorParser.pseudo({ value: `:not(${twSelector} ${lastSelector})` }));
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
