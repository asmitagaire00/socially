// don't really need this file as babel loader is used in webpack
// but jest couldn't figure out the transpiled es6 by webpack
// therefore separate babel config is needed here.

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: ['@babel/transform-runtime'],
};
