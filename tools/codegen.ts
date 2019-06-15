import { ApolloServer } from 'apollo-server';
import getPort from 'get-port';
import rimraf from 'rimraf';
import execa from 'execa';
import runWebpack from './lib/runWebpack';
import webpackConfig from './webpack.config';

const [, serverConfig] = webpackConfig;

/**
 * Generate Flow declarations from GraphQL. Since it requires
 * a running GraphQL server, it launches a server for the use.
 */
export default async function codegen() {
  const promiseRemoveOldTypes = new Promise(resolve =>
    rimraf('{./,src/**/}__generated__', resolve),
  );

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

  const promisePort = getPort();

  const [port] = await Promise.all([
    promisePort,
    promiseRemoveOldTypes,
    promiseCompileSchemaJs,
  ]);

  // eslint-disable-next-line global-require, import/no-dynamic-require, import/no-unresolved
  const builtSchema = require('../build/schema').default;
  const server = new ApolloServer(builtSchema);
  const { server: httpServer } = await server.listen({ port });

  await execa(
    'yarn',
    [
      'apollo',
      'client:codegen',
      '--target',
      'typescript',
      '--endpoint',
      `http://localhost:${port}/graphql`,
    ],
    {
      stdio: 'inherit',
    },
  );

  await new Promise(resolve => httpServer.close(resolve));
}
