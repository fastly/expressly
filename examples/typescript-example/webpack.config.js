const path = require("path");

module.exports = {
  stats: { errorDetails: true },
  target: "webworker",
  output: {
    path: path.join(process.cwd(), "bin"),
    filename: "index.js",
  },
  // mode: 'production',
  mode: "production",
  devtool: "cheap-module-source-map",
  optimization: {
    sideEffects: true,
    minimize: false
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    fallback: {
      url: require.resolve("core-js/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
    ],
  },
};
