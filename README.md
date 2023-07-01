[![Build Status](https://travis-ci.org/soluml/stylelint-selector-no-top-level-tag.svg?branch=master)](https://travis-ci.org/soluml/stylelint-selector-no-top-level-tag)
[![NPM version](https://img.shields.io/npm/v/stylelint-selector-no-top-level-tag.svg)](https://www.npmjs.com/package/stylelint-selector-no-top-level-tag)

# stylelint-selector-no-top-level-tag

A [stylelint](https://github.com/stylelint/stylelint) plugin to disallow top-level tag selectors without qualifiers.

_note_: This plugin was inspired heavily by the [`stylelint-selector-tag-no-without-class`](https://github.com/Moxio/stylelint-selector-tag-no-without-class) plugin as the underlying approach is similar. However, as the rationale is fundamentally different, it made sense to migrate these features to a new plugin.

By default, this rule disallows all top-level tags. The following patterns are considered violations:

```css
div {
}
```

```css
button:hover {
}
```

```css
div:first-child {
}
```

```css
div::before {
}
```

```css
div > .foo {
}
```

```css
@media (min-width: 30em) {
  span {
  }
}
```

The following patterns are not considered violations:

```css
div.foo {
} /* (tag is qualified with a class) */
```

```css
.foo {
  > span {
  }
} /* (tag is nested beneath .foo */
```

```css
.foo {
  & span {
  }
} /* (tag is nested beneath .foo */
```

## Rationale

Tag selectors, like `<div>`, are very broad selectors which are useful when used in stylesheets like a [reset](https://css-tricks.com/reboot-resets-reasoning/). However, when building shareable components, it's easy to accidentally use tag selectors while under the impression that they're scoped to the component. This linter can help you idenetify leaky tag selectors and help prevent style issues in downstream applications consuming shareable components/css.

## Installation

Install this package as a development dependency using NPM:

```
npm i --save-dev stylelint-selector-no-top-level-tag
```

## Usage

Add the plugin and the corresponding rule to the stylelint configuration file, and configure the tags that should not be used as a selector without a qualifying classname:

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-selector-no-top-level-tag"
  ],
  "rules": {
    "plugin/selector-tag-no-without-class": []
  }
}
```

## Primary option

`array|string`: `["array", "of", "tags", "or", "/regexes/"]|"tag"|"/regex/"`

Specification of tags that can occur at a top level. If a string is surrounded with `"/"`, it is interpreted as a regular expression. For example, `"^/h\d+$/"` disallows using any section heading without a class qualifier. _Empty array is recommended._

## Versioning

This project adheres to [Semantic Versioning](http://semver.org/). A list of notable changes for each release can be found in the [changelog](CHANGELOG.md).

## License

This plugin is released under the MIT license.
