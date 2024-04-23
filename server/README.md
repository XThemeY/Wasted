# node-typescript-boilerplate

![Sponsor](https://img.shields.io/badge/%E2%99%A5-Sponsor-fc0fb5.svg)
![TypeScript version](https://img.shields.io/badge/TypeScript-5.4-blue.svg)
![Node.js version](https://img.shields.io/badge/Node.js-%3E=%2020.9-blue.svg)
![APLv2](https://img.shields.io/badge/license-APLv2-blue.svg)
![Build Status - GitHub Actions](https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg)

👩🏻‍💻 Developer Ready: A comprehensive template. Works out of the box for most [Node.js](https://nodejs.org/dist/latest-v20.x/docs/api/) projects.

🏃🏽 Instant Value: All basic tools included and configured:

- [TypeScript](https://www.typescriptlang.org/) [5\.4](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/)
- [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ESLint](https://github.com/eslint/eslint) with some initial rules recommendation
- [Jest](https://facebook.github.io/jest/) for fast unit testing and code coverage
- Type definitions for Node.js and Jest
- [Prettier](https://prettier.io) to enforce consistent code style
- NPM [scripts](#available-scripts) for common operations
- [EditorConfig](https://editorconfig.org) for consistent coding style
- Reproducible environments thanks to [Volta](https://volta.sh)
- Example configuration for [GitHub Actions](https://github.com/features/actions)
- Simple example of TypeScript code and unit test

🤲 Free as in speech: available under the APLv2 license.

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js](https://nodejs.org/dist/latest-v20.x/docs/api/).

### Use as a repository template

To start, just click the [**Use template**](https://github.com/jsynowiec/node-typescript-boilerplate/generate) link (or the green button). Start adding your code in the `src` and unit tests in the `__tests__` directories.

### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/jsynowiec/node-typescript-boilerplate
cd node-typescript-boilerplate
npm install
```

### Download latest release

Download and unzip the current **main** branch or one of the tags:

```sh
wget https://github.com/jsynowiec/node-typescript-boilerplate/archive/main.zip -O node-typescript-boilerplate.zip
unzip node-typescript-boilerplate.zip && rm node-typescript-boilerplate.zip
```

## Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `prettier` - reformat files,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

## Additional Information

### Why include Volta

[Volta](https://volta.sh)’s toolchain always keeps track of where you are, it makes sure the tools you use always respect the settings of the project you’re working on. This means you don’t have to worry about changing the state of your installed software when switching between projects. For example, it's [used by engineers at LinkedIn](https://twitter.com/tomdale/status/1162017336699838467) to standardize tools and have reproducible development environments.

I recommend to [install](https://docs.volta.sh/guide/getting-started) Volta and use it to manage your project's toolchain.

### ES Modules

This template uses native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Make sure to read [this](https://nodejs.org/docs/latest-v16.x/api/esm.html), and [this](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#esm-nodejs) first.

If your project requires CommonJS, you will have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

Please do not open issues for questions regarding CommonJS or ESM on this repo.

## Backers & Sponsors

Support this project by becoming a [sponsor](https://github.com/sponsors/jsynowiec).

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.
