# React Starter Kit

<a href="http://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square" height="20"></a>
<a href="http://patreon.com/koistya"><img src="https://img.shields.io/badge/dynamic/json?color=%23ff424d&label=Patreon&style=flat-square&query=data.attributes.patron_count&suffix=%20patrons&url=https%3A%2F%2Fwww.patreon.com%2Fapi%2Fcampaigns%2F233228" height="20"></a>
<a href="https://discord.gg/2nKEnKq"><img src="https://img.shields.io/discord/643523529131950086?label=Chat&style=flat-square" height="20"></a>
<a href="https://github.com/kriasoft/react-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/react-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a>
<a href="https://twitter.com/koistya"><img src="https://img.shields.io/twitter/follow/koistya.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

The web's most popular front-end template for building web applications with
[React](https://reactjs.org/), [Relay](https://relay.dev/), and
[GraphQL](https://graphql.org/).

## Features

- Optimized for serverless deployment to CDN edge locations (Cloudflare Workers)
- HTML page rendering (SSR) at CDN edge locations, all ~100 points on Lighthouse
- Hot module replacement during local development using React Refetch
- Pre-configured with CSS-in-JS styling using Emotion.js
- Pre-configured with code quality tools: ESLint, Prettier, TypeScript, Jest, etc.
- Pre-configured with VSCode code snippets and other VSCode settings
- The ongoing design and development is supported by these wonderful companies:

<a href="https://reactstarter.com/s/1"><img src="https://reactstarter.com/s/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/2"><img src="https://reactstarter.com/s/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/3"><img src="https://reactstarter.com/s/3.png" height="60" /></a>

---

This project was bootstrapped with [React Starter Kit](https://github.com/kriasoft/react-starter-kit).
Be sure to join our [Discord channel](https://discord.com/invite/2nKEnKq) for assistance.

## Directory Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD workflows<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`common`](./common) — common (shared) React components<br>
`├──`[`core`](./core) — core modules and utility functions<br>
`├──`[`dialogs`](./dialogs) — React components implementing modal dialogs<br>
`├──`[`fragments`](./fragments) — common (shared) Relay fragments<br>
`├──`[`hooks`](./hooks) — React hooks such as `useLocation()`, `useCurrentUser()`, etc.<br>
`├──`[`icons`](./icons) — custom icon React components<br>
`├──`[`menu`](./menu) — React components implementing popup menus<br>
`├──`[`public`](./public) — static assets such as robots.txt, index.html etc.<br>
`├──`[`routes`](./routes) — application routes and page (screen) components<br>
`├──`[`scripts`](./scripts) — automation scripts such as `yarn deploy`<br>
`├──`[`theme`](./theme) — application theme - colors, fonts, paddings, etc.<br>
`├──`[`workers`](./workers) — Cloudflare Worker scripts (reverse proxy, SSR)<br>
`├──`[`config`](./config.ts) — client-side application settings per environment<br>
`└──`[`index.ts`](./index.ts) — application entry point<br>

## Tech Stack

- [React](https://reactjs.org/), [Relay](https://relay.dev/),
  [Emotion](https://emotion.sh/), [Material UI v5](https://next.material-ui.com/)
- [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/),
  [ESLint](https://eslint.org/), [Prettier](https://prettier.io/),
  [Jest](https://jestjs.io/), [Yarn](https://yarnpkg.com/) v2 with PnP,
  [Webpack v5](https://webpack.js.org/)

## Requirements

- [Node.js](https://nodejs.org/) v14 or newer, [Yarn](https://yarnpkg.com/) package manager
- [VS Code](https://code.visualstudio.com/) editor with [recommended extensions](.vscode/extensions.json)

## Getting Started

- Clone the repo<br />
  `git clone -o seed -b main --single-branch https://github.com/kriasoft/react-starter-kit.git`
- Install project dependencies — `yarn install`
- Launch the app — `yarn start`, it will become available at [http://localhost:3000](http://localhost:3000/)

**IMPORTANT**: Ensure that VSCode is using the workspace versions of TypeScript and ESLint.

![](https://files.tarkus.me/typescript-workspace.png)

## Scripts

- `yarn start` — Launches the app in development mode on [`http://localhost:3000`](http://localhost:3000/)
- `yarn update-schema` — Update GraphQL API schema by running an introspection query
- `yarn relay` — Updates GraphQL fragments used in the code
- `yarn build` — Compiles and bundles the app for deployment
- `yarn lint` — Validate code using ESLint
- `yarn tsc` — Validate code using TypeScript compiler
- `yarn test` — Run unit tests with Jest, Supertest
- `yarn deploy` — Deploys the app to Cloudflare

## How to Deploy

Ensure that all the environment variables for the target deployment environment
(`test`, `prod`) found in [`/core/*.env`](./core/) files are up-to-date.

If you haven't done it already, push any secret values you may need to CF Workers
environment by running `yarn cf secret put <NAME> [--env #0]`.

Finally build and deploy the app by running:

```
$ yarn build
$ yarn deploy [--env #0] [--version #0]
```

Where `--env` argument is the target deployment area, e.g. `yarn deploy --env=prod`.

## How to Update

- `yarn set version latest` — Bump Yarn to the latest version
- `yarn upgrade-interactive` — Update Node.js modules (dependencies)
- `yarn dlx @yarnpkg/sdks vscode` — Update TypeScript, ESLint, and Prettier settings in VSCode

## Contributors 👨‍💻

<a href="https://reactstarter.com/c/1"><img src="https://reactstarter.com/c/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/2"><img src="https://reactstarter.com/c/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/3"><img src="https://reactstarter.com/c/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/4"><img src="https://reactstarter.com/c/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/5"><img src="https://reactstarter.com/c/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/6"><img src="https://reactstarter.com/c/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/7"><img src="https://reactstarter.com/c/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/c/8"><img src="https://reactstarter.com/c/8.png" height="60" /></a>

## Backers 💰

<a href="https://reactstarter.com/b/1"><img src="https://reactstarter.com/b/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/2"><img src="https://reactstarter.com/b/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/3"><img src="https://reactstarter.com/b/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/4"><img src="https://reactstarter.com/b/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/5"><img src="https://reactstarter.com/b/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/6"><img src="https://reactstarter.com/b/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/7"><img src="https://reactstarter.com/b/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/8"><img src="https://reactstarter.com/b/8.png" height="60" /></a>

## Related Projects

- [GraphQL API and Relay Starter Kit](https://github.com/kriasoft/graphql-starter) — monorepo template, pre-configured with GraphQL API, React, and Relay
- [Node.js API Starter Kit](https://github.com/kriasoft/node-starter-kit) — project template, pre-configured with Node.js, GraphQL, and PostgreSQL

## How to Contribute

Anyone and everyone is welcome to [contribute](.github/CONTRIBUTING.md). Start
by checking out the list of [open issues](https://github.com/kriasoft/react-starter-kit/issues)
marked [help wanted](https://github.com/kriasoft/react-starter-kit/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the
[guidelines](.github/CONTRIBUTING.md).

## License

Copyright © 2014-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/react-starter-kit/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/react-starter-kit/graphs/contributors).</sup>
