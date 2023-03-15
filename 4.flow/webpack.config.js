let path = require('path')
const Run1Plugin = require('./plugins/run1-plugin')
const Run2Plugin = require('./plugins/run2-plugin')
const DonePlugin = require('./plugins/done-plugin')

module.exports = {
  mode: 'development',
  devtool: false, // 不生成sourcemap
  entry: {
    // 单入口可以配置成一个字符串的值
    // 多入口是一个对象
    // chunk的名称、值是入口模块的路径
    // main: './src/index.js'
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js' // 决定assets的文件名
  },
  resolve: {
    // require文件时可以不写后缀；webpack对模块后缀的解析，从左向右查找
    extensions: ['.js', '.jsx', '.ts', '.tsx']
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
  },
  // webpack编译的过程中，会触发我们注册的不同编译生命周期阶段的钩子
  // 开始编译的时候触发run事件，RunPlugin会监听这个事件执行回调
  // 编译完成的时候会触发done事件，DonePlugin会监听这个done事件的回调
  // 放在前面的插件不一定先执行，webpack内部生命周期的顺序已经确定
  // 跟订阅先后没关系，先走run再走done
  plugins: [new DonePlugin(), new Run2Plugin(), new Run1Plugin()]
}
