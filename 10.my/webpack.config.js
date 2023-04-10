const path = require("path");
module.exports = {
  context: process.cwd(), //当前的工作目录
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    chunkFilename: "[name].js", // 动态import的时候，指定生成文件的文件名
  },
};
