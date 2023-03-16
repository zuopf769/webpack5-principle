class Run2Plugin {
  //每个插件都是一个类，而每个类都需要定义一个apply方法
  apply(compiler) {
    compiler.hooks.run.tap('Run2Plugin', () => {
      console.log('run2:开始编译')
    })
  }
}
module.exports = Run2Plugin

// compiler.hooks.run 不是固定的
// hoos的key都有什么呀
// https://webpack.js.org/api/compiler-hooks/#done
