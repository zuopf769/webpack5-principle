let path = require('path')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    // chunk的名称、值是入口模块的路径
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js' // 决定assets的文件名
  },
  module: {
    rules: [
      {
        test: /\.baxx$/,
        use: [
          // loader从右向左执行
          // 最左侧的loader要返回合法的js
          path.resolve(__dirname, 'loaders/loader2.js'),
          // 最右侧的loader拿到的是源码
          path.resolve(__dirname, 'loaders/loader1.js')
        ]
      }
    ]
  }
}
