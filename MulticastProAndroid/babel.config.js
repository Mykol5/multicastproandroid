module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      ['@babel/plugin-transform-flow-strip-types', { loose: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ],
  };
};