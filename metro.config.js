const { getDefaultConfig } = require('expo/metro-config');

module.exports = {
  resolver: {
    blockList: /.*node_modules\/\.bin.*/, // Ignore symlinks in node_modules/.bin
  },
  ...getDefaultConfig(__dirname),
};

