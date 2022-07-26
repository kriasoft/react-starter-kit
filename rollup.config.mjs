/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import prettyBytes from "pretty-bytes";
import { $, chalk, fs, path } from "zx";

/**
 * Rollup configuration for compiling and bundling CF Workers scripts.
 *
 * @see https://rollupjs.org/guide/
 * @return {import("rollup").RollupOptions}
 */
export default {
  input: `./index.ts`,
  output: {
    name: $.env.TARGET,
    file: `../${$.env.TARGET}/dist/index.js`,
    format: "es",
    minifyInternalExports: true,
    generatedCode: "es2015",
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".node"],
      browser: true,
    }),
    commonjs(),
    json(),
    babel({
      configFile: path.join($.env.PROJECT_CWD, "babel.config.cjs"),
      extensions: [".js", ".mjs", ".ts", ".tsx"],
      babelHelpers: "bundled",
    }),
    {
      name: "custom",
      async buildStart() {
        await fs.emptyDir(`../${$.env.TARGET}/dist`);
      },
      generateBundle(options, bundle) {
        if (!process.argv.includes("--silent") && !this.meta.watchMode) {
          const file = path.basename(options.file);
          const size = bundle[file].code.length;
          const prettySize = chalk.green(prettyBytes(size));
          console.log(`${chalk.cyan("file size:")} ${prettySize}`);
        }
      },
    },
  ],
  external: ["__STATIC_CONTENT_MANIFEST"],
};
