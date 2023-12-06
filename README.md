# Constructor.io Product Listing Pages (PLP) UI Library

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Constructor-io/constructorio-ui-plp/blob/main/LICENSE)

## Introduction

A UI Library that provides React components to manage the fetching and rendering logic for [Search](https://constructor.io/products/search/) & [Browse](https://constructor.io/products/browse/) pages powered by Constructor.io. Typescript support is available.

Our [Storybook Docs](https://constructor-io.github.io/constructorio-ui-plp/?path=/docs/general-introduction--documentation) are the best place to explore the behavior and the available configuration options for this UI Library.

## Installation

```bash
npm i @constructor-io/constructorio-ui-plp
```

## Usage

### Using the React Component

The `CioPlp` component handles state management, data fetching, and rendering logic for the entire PLP.

```jsx
import CioPlp from '@constructor-io/constructorio-ui-plp';

function YourComponent() {
  return (
    <div>
      <CioPlp apiKey='key_M57QS8SMPdLdLx4x' />
    </div>
  );
}
```

### Using the Javascript Bundle

This is a framework agnostic method that can be used in any JavaScript project. The `CioPlp` function provides a simple interface to inject an entire PLP UI into the provided `selector`.
In addition to [PLP component props](https://constructor-io.github.io/constructorio-ui-plp/?path=/docs/plp-component--docs), this function also accepts `selector` and `includeCSS`.

```js
import CioPlp from '@constructor-io/constructorio-ui-plp/constructorio-ui-plp-bundled';

CioPlp({
  selector: '#plp-container',
  includeCSS: true, // Include the default CSS styles. Defaults to true.
  apiKey: 'key_M57QS8SMPdLdLx4x',
  // ... additional arguments
});
```

## Custom Styling

### Library defaults

By default, importing React components from this library does not pull any css into your project.

If you wish to use some starter styles from this library, add an import statement similar to the example import statement below:

```js
import '@constructor-io/constructorio-ui-plp/styles.css';
```

- These starter styles can be used as a foundation to build on top of, or just as a reference for you to replace completely.
- To opt out of all default styling, simply do not import the `styles.css` stylesheet.
- All starter styles in this library are scoped within the `.cio-plp` css selector.
- These starter styles are intended to be extended by layering in your own css rules
- If you import the starter styles, `CioPlp` component will take up the full width and height of its parent container

> Please note the starter styles utilize @container queries and enable responsive styles for our PLPs based on the size of their container element. Since this feature is supported by modern browsers, polyfills have not been included in this library. However, if you want to support older browsers, you can add fallback styles or use a [polyfill](https://github.com/GoogleChromeLabs/container-query-polyfill).

## Troubleshooting

### Known Issues

**Older Javascript environments**

The library provides two different builds. CommonJS (cjs) and ECMAScript Modules (mjs) 

For ECMAScript Modules (mjs) build. The Javascript version is ESNext which might not be supported by your environment.
If that's the case and your environment is using an older Javascript version like ES6 (ES2015), you might get this error.

`Module parse failed: Unexpected token (15:32)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file`

To solve this you can import the CommonJS (cjs) build which supports ES6 (ES2015) syntax:

`import CioPlp from '@constructor-io/constructorio-ui-plp/cjs'`

**ESLint**

There is a known issue with ESLint where it fails to resolve the paths exposed in the `exports` statement of NPM packages. If you are receiving the following error, you can safely disable ESLint using `// eslint-disable-line` for that line.

`Unable to resolve path to module '@constructor-io/constructorio-ui-plp/styles.css'`

Relevant open issues:

[Issue 1868](https://github.com/import-js/eslint-plugin-import/issues/1868)

[Issue 1810](https://github.com/import-js/eslint-plugin-import/issues/1810)

## Local Development

### Development scripts

```bash
npm ci                  # install dependencies for local dev
npm run dev             # start a local dev server for Storybook
npm run lint            # run linter
```

### Maintain Library

```bash
npm run compile           # generate lib folder for publishing to npm
npm run build-storybook   # generate storybook static bundle for deploy with GH Pages
```

## Supporting Docs

- [Storybook 7 Introduction](https://storybook.js.org/docs/7.0/react/get-started/introduction)
- [Typescript Docs](https://www.typescriptlang.org/docs/)
