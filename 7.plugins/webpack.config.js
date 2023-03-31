const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AutoExternalPlugin = require("./plugins/auto-external-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  /* 
  externals: {
    'jquery': '$',//当引入jquery的时候，不要去node_modules里找，应该找window.$
    'lodash':"_"  //当引入lodash的时候，不要去的node_modules里找，应该找window._
  }, */
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new AutoExternalPlugin({
      jquery: {
        url: "https://cdn.bootcss.com/jquery/3.1.0/jquery.js",
        variable: "$",
      },
      lodash: {
        url: "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js",
        variable: "_",
      },
    }),
  ],
};
