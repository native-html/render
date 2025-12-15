# @native-html/css-processor

[![npm](https://img.shields.io/npm/v/@native-html/css-processor)](https://www.npmjs.com/package/@native-html/css-processor)
[![CI](https://github.com/native-html/render/workflows/css-processor/badge.svg?branch=main)](https://github.com/native-html/render/actions?query=branch%3Amain+workflow%3Acss-processor)
[![codecov](https://codecov.io/gh/native-html/render/branch/main/graph/badge.svg?flag=css-processor)](https://codecov.io/gh/native-html/render?flag=css-processor)

## Known Incompatibilities (Inline CSS Style → RN Styles)

| Property         | Comments                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `border-*radius` | Percent and forward-slash radius is not supported in React Native. Inline rules with percent or forward-slash radius will be discarded. |
