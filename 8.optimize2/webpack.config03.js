const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// chunkhash 采用hash计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。
// 这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即chunkhash,
// chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
// 我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，
// 接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
module.exports = {
  // 如果mode是production,会启用压缩插件, 如果配置为none表示不会启用压缩插件
  mode: "development",
  // mode: "none",
  devtool: false,
  // 多入口
  entry: {
    // main: "./src/index.js", // 可以是一个字符串，也可以是一个数组
    main: ["./src/index.js", "./src/index2.js"], // index和index2会打包在一起
    vendor: ["lodash"], // 单独作为一个chunk单独打出一个bundle；chunkhash不会改变
  },
  output: {
    path: path.resolve("build"),
    filename: "[name].[chunkhash:8].js", // 取hash的前8位
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
          filename: "images/[chunkhash:8][ext]",
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
      filename: "css/[name].[chunkhash:8].css", // 可以指定输出目录css
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩css
  ],
};
