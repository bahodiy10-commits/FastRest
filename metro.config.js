const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.blockList = [
  /node_modules\/@react-native\/community-cli-plugin\/.*/,
  /node_modules\/firebase\/.*\/cordova\/.*/,
  /node_modules\/firebase\/.*\/web-extension\/.*/,
  /node_modules\/firebase\/.*\/lite\/.*/,
  /node_modules\/firebase\/compat\/.*/,
];
config.watcher = { additionalExts: ['mjs', 'cjs'] };
module.exports = config;
