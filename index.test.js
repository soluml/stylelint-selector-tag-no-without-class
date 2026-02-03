import plugin from "./index.js";
import { testRule } from "stylelint-test-rule-node";

const plugins = [plugin];
const {
  ruleName,
  rule: { messages },
} = plugin;

testRule({
  plugins,
  ruleName: ruleName,
  config: ["b", "/^h[0-6]$/"],

  accept: [
    { code: "h1 {}" },
    { code: "b:hover {}" },
    { code: "span.foo, h5 {}" },
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
      code: "span.foo, address {}",
      message: messages.unexpected("address"),
      line: 1,
      column: 1,
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
  plugins,
  ruleName: ruleName,
  config: [],

  accept: [
    { code: "div.foo {}" },
    { code: "@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }" },
  ],

  reject: [
    {
      code: "div {}",
      message: messages.unexpected("div"),
      line: 1,
      column: 1,
    },
  ],
});
