const resolve = require("path").resolve;
const { EnvironmentPlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: resolve(__dirname, "./packages/app/src/index.tsx"),
  output: {
    path: resolve(__dirname, "./dist"),
    publicPath: "/",
    filename: "static/js/[contenthash].bundle.js",
  },
  mode: "production",
  target: "web",
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
    fallback: {
      events: require.resolve("events"),
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "source-map",
  plugins: [
    new EnvironmentPlugin({
      BASE_URL: "",
      SUPABASE_PROD_ANON_KEY: "",
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: resolve(__dirname, "./packages/app/src/public"),
          to: resolve(__dirname, "./dist/public"),
        },
      ],
    }),
    new HTMLWebpackPlugin({
      title: "DNT Platform",
      template: resolve(__dirname, "./packages/app/src/index.html"),
    }),
  ],
};
