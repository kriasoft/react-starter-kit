/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import envars from "envars";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { IgnoreAsyncImportsPlugin } from "ignore-webpack-plugin";
import InlineChunkHtmlPlugin from "inline-chunk-html-plugin";
import { createRequire } from "module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Webpack configuration.
 *
 * @see https://webpack.js.org/configuration/
 * @param {Record<string, boolean>} args
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
export default function config(args, options) {
  // Load environment variables for the target environment
  const envName = args.prod === true ? "prod" : args.test === true ? "test" : "local"; // prettier-ignore
  const env = envars.config({ env: envName });

  const isProduction = options.mode === "production";
  const isDevServer = process.argv.includes("serve");
  const isProfile = process.argv.includes("--profile");

  process.env.BABEL_ENV = options.mode;
  process.env.BROWSERSLIST_ENV = options.mode;

  /**
   * Client-side application bundle.
   *
   * @see https://webpack.js.org/configuration/
   * @type {Configuration}
   */
  const appConfig = {
    name: "app",
    mode: isProduction ? "production" : "development",
    target: isDevServer ? "web" : "browserslist",
    bail: isProduction,

    entry: "./index",

    output: {
      path: path.resolve(__dirname, "dist"),
      pathinfo: !isProduction,
      filename: isProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      chunkFilename: isProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      publicPath: "/",
      uniqueName: "app",
    },

    devtool: isProduction ? "source-map" : "cheap-module-source-map",

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: { ecma: 8 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: { safari10: true },
            keep_classnames: isProduction && isProfile,
            keep_fnames: isProduction && isProfile,
            output: { ecma: 5, comments: false, ascii_only: true },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          commons: {
            test: /[\\/].yarn[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },

    performance: {
      maxAssetSize: 650 * 1024,
      maxEntrypointSize: 650 * 1024,
    },

    resolve: {
      extensions: [".wasm", ".mjs", ".js", ".ts", ".d.ts", ".tsx", ".json"],
      alias: {
        ...(isProduction &&
          isProfile && {
            "react-dom$": "react-dom/profiling",
            "scheduler/tracing": "scheduler/tracing-profiling",
          }),
      },
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: 10000,
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            {
              test: /\.(js|mjs|ts|tsx)$/,
              include: path.resolve(__dirname),
              loader: "babel-loader",
              options: {
                rootMode: "upward",
                plugins: [
                  ["@babel/plugin-transform-runtime"],
                  [
                    "babel-plugin-import",
                    {
                      libraryName: "@mui/material",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "material",
                  ],
                  [
                    "babel-plugin-import",
                    {
                      libraryName: "@mui/icons-material",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "icons-material",
                  ],
                  [
                    "babel-plugin-import",
                    {
                      libraryName: "@mui/lab",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "lab",
                  ],
                  isDevServer && "react-refresh/babel",
                ].filter(Boolean),
                cacheDirectory: ".cache/babel-loader",
                cacheCompression: false,
                compact: false, // isProduction,
                sourceType: "unambiguous",
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin(
        Object.fromEntries(
          Object.keys(env).map((key) => [
            `process.env.${key}`,
            isProduction ? `window.env.${key}` : JSON.stringify(env[key]),
          ])
        )
      ),
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, "public/index.html"),
        ...(isProduction && {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
      }),
      isProduction &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      !isDevServer &&
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "./public",
              filter: (filename) =>
                filename !== path.resolve(__dirname, "public/index.html"),
            },
          ],
        }),
      isDevServer && new webpack.HotModuleReplacementPlugin(),
      isDevServer && new ReactRefreshWebpackPlugin(),
      new WebpackManifestPlugin({ fileName: "assets.json", publicPath: "/" }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ].filter(Boolean),
  };

  /**
   * Cloudflare Worker script acting as a reverse proxy.
   *
   * @see https://webpack.js.org/configuration/
   * @type {Configuration}
   */
  const proxyConfig = {
    ...appConfig,
    name: "workers",
    entry: "./workers/proxy",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "proxy.js",
      uniqueName: "proxy",
    },
    performance: {
      maxAssetSize: 1000 * 1024,
      maxEntrypointSize: 1000 * 1024,
    },
    devtool: false,
    target: "browserslist:last 2 Chrome versions",
    plugins: [
      new IgnoreAsyncImportsPlugin(),
      new webpack.DefinePlugin(
        Object.fromEntries(
          Object.keys(env).map((key) => [`process.env.${key}`, key])
        )
      ),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      options.analyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    optimization: {
      ...appConfig.optimization,
      splitChunks: {},
      runtimeChunk: false,
      minimize: false,
    },
  };

  /**
   * Development server that provides live reloading.
   *
   * @see https://webpack.js.org/configuration/dev-server/
   * @type {import("webpack-dev-server").Configuration}
   */
  const devServer = {
    static: "./public",
    compress: true,
    historyApiFallback: { disableDotRule: true },
    port: 3000,
    hot: true,
    proxy: [
      {
        context: ["/api", "/auth"],
        target: process.env.API_ORIGIN,
        changeOrigin: true,
        onProxyReq(proxyReq, req) {
          const origin = `${req.protocol}://${req.hostname}:3000`;
          proxyReq.setHeader("origin", origin);
        },
      },
    ],
  };

  return isDevServer ? { ...appConfig, devServer } : [appConfig, proxyConfig];
}
