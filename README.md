<p align="center">
  <div align="center">
    <a href=""
      ><img
        src="https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20MacOs%20%7C%20Windows-brightgreen.svg?colorB=191A17"
        alt="platforms"
    /></a>
    <a href="https://github.com/expo/expo"
      ><img
        src="https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat&amp;logo=EXPO&amp;labelColor=ffffff&amp;logoColor=000"
        alt="runs with expo"
    /></a>
  </div>
  <div align="center">
    <a href="https://www.npmjs.com/package/@native-html/render"
      ><img
        src="https://img.shields.io/npm/v/@native-html/render/latest"
        alt="npm"
    /></a>
    <a href="https://www.npmjs.com/package/@native-html/render"
      ><img
        src="https://img.shields.io/npm/v/@native-html/render/next"
        alt="npm"
    /></a>
    <a href="https://www.npmjs.com/package/@native-html/render"
      ><img
        src="https://img.shields.io/npm/dm/@native-html/render.svg?colorB=007ec6"
        alt="npm"
    /></a>
  </div>
  <div align="center">
    <a href="https://codecov.io/gh/native-html/render"
      ><img
        src="https://img.shields.io/codecov/c/gh/native-html/render"
        alt=""
    /></a>
    <a href="https://github.com/native-html/render/issues"
      ><img
        src="https://img.shields.io/github/issues/native-html/render.svg"
        alt="github issues"
    /></a>
    <a href="https://semver.org/spec/v2.0.0.html"
      ><img src="https://img.shields.io/badge/semver-2.0.0-e10079.svg" alt=""
    /></a>
  </div>
  <div align="center">
    <a href="https://discord.gg/dbEMMJM"
      ><img
        src="https://img.shields.io/discord/736906960041148476?label=discord"
        alt=""
    /></a>
  </div>
</p>
<br/>
<p align="center">
    <a href="https://native-html.github.io/render/"><img width="124" height="124" src="https://github.com/native-html/render/raw/main/assets/logo.svg"></a>
</p>
<h1 align="center">@native-html/render</h1>
<p align="center">
  <sup>Based on the original work of <a href="https://github.com/Thomas101">Thomas Beverley</a>, props to him.</sup>
</p>
<p align="center">
An iOS/Android pure javascript react-native component that renders your HTML into 100% native views.
</p>
<p align="center">
    <a href="https://native-html.github.io/render/blog/2021/06/27/create-blog-app-rnrh-I"><img width="320" height="744" src="https://github.com/native-html/render/raw/main/assets/demo.gif"></a>
</p>

### 🗃️ Releases

** We've moved from `react-native-render-html` to `@native-html/native`.
The v1 release is stable, and is now-on the recommended.
`@native-html/native` v1 follows exactly the same API as `react-native-render-html` does, so migrating is plug-and-play.

> :warning: **You are on the main branch which is home for the latest development.**
> Check the table bellow to get documentation for your exact
> version.

| Minor | Branch                                                                                   | Documentation                                                                                              | Latest                                                                         |
| ----- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| next  | main                                                                                   | -                                                                                                          | [![npm](https://img.shields.io/npm/v/@native-html/render/next)](#)        |

<a name="prereleases"></a>

## :computer: Install

```bash
npm install @native-html/render
```

```bash
yarn add @native-html/render
```

## :speedboat: Basic Usage

```jsx
import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml from '@native-html/render';

const source = {
  html: `
<p style='text-align:center;'>
  Hello World!
</p>`
};

export default function App() {
  const { width } = useWindowDimensions();
  return (
    <RenderHtml
      contentWidth={width}
      source={source}
    />
  );
}
```

## :blue_book: Documentation

See our [official website](https://native-html.github.io/render/)

## :iphone: Example

You like to learn by example? We have a tutorial from which the demo GIF has been extracted: [A WebView-free Blog App with Native HTML](https://native-html.github.io/render/blog/2021/06/27/create-blog-app-rnrh-I).

## :notebook: Changelog

The changelog is available here: [packages/render-html/CHANGELOG.md](./packages/render-html/CHANGELOG.md).

## :bulb: Help

Please refer to [our dedicated document](./HELP.adoc).

## 👥 Community

You're always welcome to join our [discord channel](https://discord.gg/dbEMMJM) :-).

## Credits

This project has been built and is maintained thanks to the support from [jsamr](https://github.com/jsamr) and [Software Mansion](https://swmansion.com)

[![jsamr](https://avatars.githubusercontent.com/u/3646758?s=100 'jsamr')](https://github.com/jsamr)
[![swm](https://logo.swmansion.com/logo?color=white\&variant=desktop\&width=150\&tag=react-native-reanimated-github 'Software Mansion')](https://swmansion.com)

## :pencil: Contributing

Check-out our [contributing guide](./CONTRIBUTING.adoc).

- You can report bugs in [our Issue Tracker](https://github.com/meliorence/native-html/render/issues);
- We handle Feature Requests [in our Canny board](https://native-html.canny.io/features).

## :blue_heart: Sponsorship

Want to support this project or hire us to implement a feature? [Check out this page](https://github.com/sponsors/jsamr).

# Core Libraries for @native-html/render

| Package                                                                         | Release                                                                                                                                         | Build Status                                                                                                                                                                                               | Coverage                                                                                                                                                                             |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [@native-html/css-processor](packages/css-processor#readme)                     | [![npm](https://img.shields.io/npm/v/@native-html/css-processor)](https://www.npmjs.com/package/@native-html/css-processor)                     | [![CI](https://github.com/native-html/render/workflows/css-processor/badge.svg?branch=main)](https://github.com/native-html/render/actions?query=branch%3Amain+workflow%3Acss-processor)                   | [![codecov](https://codecov.io/gh/native-html/render/branch/main/graph/badge.svg?flag=css-processor)](https://codecov.io/gh/native-html/render?flag=css-processor)                     |
| [@native-html/transient-render-engine](packages/transient-render-engine#readme) | [![npm](https://img.shields.io/npm/v/@native-html/transient-render-engine)](https://www.npmjs.com/package/@native-html/transient-render-engine) | [![CI](https://github.com/native-html/render/workflows/transient-render-engine/badge.svg?branch=main)](https://github.com/native-html/render/actions?query=branch%3Amain+workflow%3Atransient-render-tree) | [![codecov](https://codecov.io/gh/native-html/render/branch/main/graph/badge.svg?flag=transient-render-engine)](https://codecov.io/gh/native-html/render?flag=transient-render-engine) |
