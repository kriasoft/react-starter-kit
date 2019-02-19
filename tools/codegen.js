import { ApolloServer } from 'apollo-server';
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
      entry: './src/data/schema.js',
      output: {
        path: serverConfig.output.path,
        filename: 'schema.js',
        libraryTarget: 'commonjs2',
      },
    },
    serverConfig.stats,
  );

  // eslint-disable-next-line global-require, import/no-dynamic-require, import/no-unresolved
  const builtSchema = require('../build/schema').default;
  const server = new ApolloServer(builtSchema);
  const { server: httpServer } = await server.listen({ port: 3000 });

  await spawn('yarn', ['codegen:use-dev-server'], {
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
