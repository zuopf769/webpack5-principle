const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const bootstrap = path.resolve(
  __dirname,
  "node_modules/bootstrap/dist/css/bootstrap.css"
);

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    clean: true,
  },
  // resolve模块解析: 配置如何查找源代码中引入的模块
  resolve: {
    // 后缀：加载模块时可以不写后缀，那么处理后缀的顺序按下面的顺序
    extensions: [".js", ".jsx", ".json", ".css"],
    // 别名：
    alias: {
      bootstrap,
    },
    modules: ["mymodules", "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
