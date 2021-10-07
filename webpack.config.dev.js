const resolve = require("path").resolve;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypescript = require("react-refresh-typescript");

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
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              getCustomTransformers: () => ({
                before: [ReactRefreshTypescript],
              }),
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "DNT Platform",
      template: resolve(__dirname, "./packages/app/src/index.html"),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
};
