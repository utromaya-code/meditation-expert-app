// Metro config to improve reliability when file watching is flaky
// (e.g. projects stored in iCloud Drive folders).
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Force polling-based file watching. This is slower, but far more robust.
config.watcher = {
  ...(config.watcher || {}),
  usePolling: true,
  interval: 1000,
};

module.exports = config;

