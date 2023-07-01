const {
  rule: { ruleName, messages },
} = require(".");

testRule({
  ruleName: ruleName,
  config: ["span"],

  accept: [
    { code: "span.foo {}" },
    { code: "div.foo {}" },
    { code: ".foo span {}" },
    { code: ".foo div {}" },
    { code: ".foo { > span {} }" },
    { code: ".foo { & span {} }" },
    { code: "span.foo, h1.bar > h2.baz > h3.qux {}" },
    {
      code: "@media(min-width: 30em) { @media(min-width: 40em) { .foo span {} } }",
    },
  ],

  reject: [
    { code: "h1 {}", message: messages.unexpected("h1"), line: 1, column: 1 },
    {
      code: "div {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
    {
      code: "@media(min-width: 30em) { @media(min-width: 40em) { span {} } }",
      message: messages.unexpected("span"),
      line: 1,
      column: 53,
    },
    {
      code: "div > .foo {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
    {
      code: "div  .foo {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
    {
      code: "span.foo, h1 {}",
      message: messages.unexpected("h1"),
      line: 1,
      column: 11,
    },
    {
      code: "div:hover {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
    {
      code: "div::before {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
    {
      code: "div:first-child {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
    {
      code: "div, div.foo {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
  ],
});

testRule({
  ruleName: ruleName,
  config: ["/./"],

  accept: [
    // https://github.com/Moxio/stylelint-selector-tag-no-without-class/issues/5
    { code: "@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }" },
  ],
});
