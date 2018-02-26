// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-stage-2',
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  plugins: ['@babel/plugin-proposal-decorators'],
  ignore: ['node_modules', 'build'],
};
