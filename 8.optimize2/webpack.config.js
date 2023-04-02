const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  //如果mode是production,会启用压缩插件, 如果配置为none表示不会启用压缩插件
  mode: "development",
  // mode: "none",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve("build"),
    filename: "[name].js",
    clean: true,
  },
  // 优化
  optimization: {
    minimize: true, // 启用压缩js
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }, // 不在需要style-loader了
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      // 压缩html
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css", // 可以指定输出目录css
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩css
  ],
};
