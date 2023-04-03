const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// 使用chunkhash存在一个问题，就是当在一个JS文件中引入CSS文件，编译后它们的hash是相同的，
// 而且只要js文件发生改变 ，关联的css文件hash也会改变,
// 这个时候可以使用mini-css-extract-plugin里的contenthash值，
// 保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建
module.exports = {
  // 如果mode是production,会启用压缩插件, 如果配置为none表示不会启用压缩插件
  mode: "development",
  // mode: "none",
  devtool: false,
  // 多入口
  entry: {
    // main: "./src/index.js", // 可以是一个字符串，也可以是一个数组
    main: ["./src/index.js", "./src/index2.js"], // index和index2会打包在一起
    vendor: ["lodash"], // 单独作为一个chunk单独打出一个bundle；即使main入口有改动，vendor入口的chunkhash也不会改变
  },
  output: {
    path: path.resolve("build"),
    filename: "[name].[contenthash:8].js", // 取hash的前8位
    clean: true,
  },
  // 优化
  optimization: {
    minimize: true, // 启用压缩js
    minimizer: [new TerserPlugin()],
    // moduleIds: "deterministic", // 生产环境配置；根据模块名称生成简短的hash值
    moduleIds: "natural", // 自然数；默认；按使用顺序的数字ID；删除某些些文件可能会导致缓存失效
    // chunkIds: "deterministic",
    chunkIds: "natural",
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
          filename: "images/[contenthash:8][ext]",
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
      filename: "css/[name].[contenthash:8].css", // 可以指定输出目录css
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩css
    // new HashPlugin(), // 修改hash的plugin
  ],
};
