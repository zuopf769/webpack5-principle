class Run2Plugin {
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
