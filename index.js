const _ = require("lodash");
const stylelint = require("stylelint");
const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
const parseSelector = require("stylelint/lib/utils/parseSelector");
const matchesStringOrRegExp = require("stylelint/lib/utils/matchesStringOrRegExp");

const ruleName = "plugin/selector-no-top-level-tag";
const messages = stylelint.utils.ruleMessages(ruleName, {
  unexpected: (tagName) =>
    `Unexpected top-level tag ${tagName} without qualifier`,
});

const rule = function (primaryOption) {
  return function (root, result) {
    let validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [_.isString],
    });

    if (!validOptions) {
      return;
    }

    function checkSelector(selectorNode, ruleNode) {
      const combinedSegments = selectorNode.split(
        (node) => node.type === "combinator"
      );
      const flattenedSegments = combinedSegments.flat(Infinity);
      const startsWith = flattenedSegments[0];

      if (
        (startsWith.type === "tag" && flattenedSegments.length === 1) ||
        (startsWith.type === "tag" &&
          _.get(flattenedSegments, "[1].type") === "combinator") ||
        (startsWith.type === "tag" &&
          _.get(flattenedSegments, "[1].type") === "pseudo")
      ) {
        var fail = !matchesStringOrRegExp(startsWith.value, primaryOption);
      }

      if (fail) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: ruleNode,
          message: messages.unexpected(startsWith.value),
          word: startsWith,
        });
      }
    }

    function checkSelectorRoot(selectorRootNode, ruleNode) {
      selectorRootNode.each((selectorNode) => {
        checkSelector(selectorNode, ruleNode);
      });
    }

    root.walkRules((ruleNode) => {
      if (!isStandardSyntaxRule(ruleNode)) {
        return;
      }

      if (!isStandardSyntaxSelector(ruleNode.selector)) {
        return;
      }

      if (
        ruleNode.nodes.some(
          (node) => ["rule", "atrule"].indexOf(node.type) !== -1
        )
      ) {
        // Skip unresolved nested selectors
        return;
      }

      if (
        ruleNode.parent &&
        ruleNode.parent.type === "atrule" &&
        ruleNode.parent.name === "keyframes"
      ) {
        // Skip rules within an @keyframes at-rule
        // (https://github.com/Moxio/stylelint-selector-tag-no-without-class/issues/5)
        return;
      }

      ruleNode.selectors.forEach((selector) => {
        parseSelector(selector, result, ruleNode, (container) =>
          checkSelectorRoot(container, ruleNode)
        );
      });
    });
  };
};

rule.primaryOptionArray = true;
rule.ruleName = ruleName;
rule.messages = messages;
module.exports = stylelint.createPlugin(ruleName, rule);
