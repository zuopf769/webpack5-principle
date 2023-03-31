const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DonePlugin = require("./plugins/done-plugin");
const ArchivePlugin = require("./plugins/archive-plugin");

// 加了HtmlWebpackPlugin这个插件后ArchivePlugin会触发两次
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: "./src/index.html",
    // }),
    new DonePlugin(),
    new ArchivePlugin({ filename: "[timestamp].zip" }),
  ],
};
