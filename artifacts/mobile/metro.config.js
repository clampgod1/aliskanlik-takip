const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
const existingBlockList = config.resolver.blockList;
const extraPatterns = [/.*_tmp_.*/, /.*\/expo-notifications.*_tmp_.*/];

if (Array.isArray(existingBlockList)) {
  config.resolver.blockList = [...existingBlockList, ...extraPatterns];
} else if (existingBlockList) {
  config.resolver.blockList = [existingBlockList, ...extraPatterns];
} else {
  config.resolver.blockList = extraPatterns;
}

module.exports = config;
