// webpack的插件是一个类
class RunPlugin {
  //每个插件都是一个类，而每个类都需要定义一个apply方法
  apply(compiler) {
    // 在此插件里可以监听run这个钩子
    // compiler.hooks有很多的hooks，代表webpack编译流程中的某个生命周期阶段
    compiler.hooks.run.tap('Run1Plugin', () => {
      console.log('run1:开始编译')
    })
  }
}
module.exports = RunPlugin

// compiler.hooks.run 不是固定的
// hoos的key都有什么呀
// https://webpack.js.org/api/compiler-hooks/#done
