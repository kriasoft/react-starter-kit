import { ApolloServer } from 'apollo-server';
import getPort from 'get-port';
import { spawn } from './lib/cp';
import webpackConfig from './webpack.config';
import runWebpack from './lib/runWebpack';
import run from './run';
import clean from './clean';

/* eslint-disable-next-line no-unused-vars */
const [_, serverConfig] = webpackConfig;

/**
 * Generate Flow declarations from GraphQL. Since it requires
 * a running GraphQL server, it launches a server for the use.
 */
export default async function codegen() {
  await runWebpack(
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

  const port = await getPort();

  // eslint-disable-next-line global-require, import/no-dynamic-require, import/no-unresolved
  const builtSchema = require('../build/schema').default;
  const server = new ApolloServer(builtSchema);
  const { server: httpServer } = await server.listen({ port });

  await spawn('yarn', [
    'apollo', 'client:codegen',
    '--target', 'typescript',
    '--endpoint', `http://localhost:${port}/graphql`,
  ], {
    stdio: 'inherit',
  });

  await new Promise(resolve => {
    httpServer.close(() => {
      console.info('Server closed');
      resolve();
    });
  });

  await run(clean);
}
