const resolve = require("path").resolve;
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: resolve(__dirname, "./packages/app/src/index.tsx"),
  output: {
    path: resolve(__dirname, "./dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  mode: "development",

  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { modules: { exportLocalsConvention: "camelCase" } },
          },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
    fallback: {
      events: require.resolve("events"),
    },
  },
  devtool: "source-map",
  devServer: {
    host: "localhost",
    port: "1234",
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: true,
    },
  },
  stats: "minimal",
  plugins: [
    new htmlWebpackPlugin({
      title: "DNT Platform",
      template: resolve(__dirname, "./packages/app/src/index.html"),
    }),
  ],
};
