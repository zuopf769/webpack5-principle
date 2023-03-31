const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 内置的externals需要手动在html中插入cdn地址
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  externals: {
    //key jquery是要require或import 的模块名,值 jQuery是一个全局变量名
    jquery: "$", //当引入jquery的时候，不要去node_modules里找，应该找window.$
    lodash: "_", //当引入lodash的时候，不要去的node_modules里找，应该找window._
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
