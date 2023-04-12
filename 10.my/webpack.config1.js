const path = require("path");
module.exports = {
  context: process.cwd(), //当前的工作目录
  mode: "development",
  devtool: false,
  // entry: "./src/index.js",
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    chunkFilename: "[name].js", // 动态import的时候，指定生成文件的文件名
  },
};
