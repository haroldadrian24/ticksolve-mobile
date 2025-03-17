const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude node_modules from the resolver
config.resolver = {
  ...config.resolver,
  blockList: [
    ...config.resolver.blockList || [],
    /node_modules\/.*/,
  ]
};

module.exports = withNativeWind(config, { input: "./global.css" });