const webpack = require("webpack")
const webpackConfig = require("./webpack.config")
debugger
// 打包器编译对象Compiler
const compiler = webpack(webpackConfig)
// 执行 Compiler 对象的 run 方法开始启动编译
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
  } else {
    // stats代表统计结果对象
    console.log(
      stats.toJson({
        files: true, // 代表打包后生成的文件
        assets: true, // 其它是一个代码块到文件的对应关系
        chunks: true, // 从入口模块出发，找到此入口模块依赖的模块，或者依赖的模块依赖的模块，合在一起组成一个代码块
        modules: true, // 打包的模块，每个文件都是一个模块，包括css、图片
      })
    )
  }
})