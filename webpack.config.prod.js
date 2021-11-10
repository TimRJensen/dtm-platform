const resolve = require("path").resolve;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//const DotenvPlugin = require("dotenv-webpack");
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
      /*{
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },*/
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
    /*minimizer: [`...`, new CssMinimizerPlugin()],*/
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "source-map",
  plugins: [
    //new DotenvPlugin({ path: "./packages/db/.env" }),
    new CleanWebpackPlugin(),
    /*new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),*/
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
