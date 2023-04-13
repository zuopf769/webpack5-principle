const path = require("path");
let webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // 取hash的前8位
    clean: true,
  },
  devServer: {
    hot: true, //
    port: 8000,
    contentBase: path.join(__dirname, "static"),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new HotModuleReplacementPlugin(), // 也可不配置，devServer/hot为true的时候webpack内部会自动添加该插件
  ],
};
