const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const smw = new SpeedMeasureWebpackPlugin();
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const bootstrap = path.resolve(
  __dirname,
  "node_modules/bootstrap/dist/css/bootstrap.css"
);

module.exports = smw.wrap({
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve("build"),
    filename: "[name].js",
    library: "calculator",
    libraryTarget: "var",
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
    // import加载第三方模块的目录，默认是node_modules目录，也可以追加自定义的目录如mymodules目录
    modules: ["mymodules", "node_modules"],
    // main入口字段
    mainFields: ["style", "main"], // 指定查找package.json中的字段顺序，改变了默认的查找规则；默认规则是["module", "main"],
    // main入口文件名，没有package.json文件的时候，优先级高的放前面，从前往后匹配
    mainFiles: ["index.js", "base.js"], // 指定模块默认加载文件名，加载模块时默认加载的文件
  },
  // 指定如何查找loader，和上面的resolve配置一样
  resolveLoader: {
    extensions: [".js"],
    modules: ["loaders", "node_modules"],
  },
  module: {
    // 一般来说webpack拿到模块后要分析里面的依赖的模块import/require
    // 某些模块我们知道它肯定没有依赖别的模块 如jquery lodash,所以可以省这一步
    // 正则
    noParse: /jquery|lodash/,
    // 函数
    noParse(request) {
      // 返回true就是不解析
      return /jquery|lodash/.test(request);
    },
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
    // moment文件夹下面的local文件不参与打包
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/, // 目录的正则
      resourceRegExp: /^\.\/locale/, //请求的正则
    }),
    // new BundleAnalyzerPlugin(),
  ],
});
