import { join as pathJoin } from 'path';
import { generate } from '@graphql-codegen/cli';
import { cleanDir } from './lib/fs';
import runWebpack from './lib/runWebpack';
import webpackConfig from './webpack.config';

const [, serverConfig] = webpackConfig;

/**
 * Generate Flow declarations from GraphQL. Since it requires
 * a running GraphQL server, it launches a server for the use.
 */
export default async function codegen() {
  const promiseRemoveOldTypes = cleanDir('{./,src/**/}__generated__');

  const promiseCompileSchemaJs = await runWebpack(
    {
      ...serverConfig,
      entry: './src/data/schema',
      output: {
        path: serverConfig.output.path,
        filename: 'schema.js',
        libraryTarget: 'commonjs2',
      },
    },
    serverConfig.stats,
  );

  await Promise.all([promiseRemoveOldTypes, promiseCompileSchemaJs]);

  // eslint-disable-next-line global-require, import/no-dynamic-require, import/no-unresolved
  const builtSchema = require('../build/schema').default;

  const genTargetDir = pathJoin(
    process.cwd(),
    'src/__generated__/dataBinders.tsx',
  );

  await generate(
    {
      schema: builtSchema.typeDefs,
      documents: './src/**/*.{graphql,ts,tsx}',
      generates: {
        [genTargetDir]: {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-react-apollo',
          ],
        },
      },
    },
    true,
  );
}
