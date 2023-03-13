const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js', // 修改相应的xx.index.js可以查看不同的场景demo
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {}
}
