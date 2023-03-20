const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * 配置自定义loader有以下几种方式
 * 1.配置绝对路径
 * 2.配置resolveLoader中的alias
 * 3.如果说loader很多，用alias一个一个配很麻烦，resolveLoader.modules
 * 指定一个目录，找loader的时候会先去此目录下面找
 */
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    /*  alias: {
      'babel-loader':path.resolve(__dirname,'loaders/babel-loader.js')
    } */
    modules: [path.resolve("loaders"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader2",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: "babel-loader3",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
