const { SyncHook } = require('tapable')
const Compilation = require('./Compilation')

// https://webpack.docschina.org/api/compiler-hooks/
// Compiler 模块是 webpack 的主要引擎，它通过 CLI 或者 Node API 传递的所有选项创建出一个 compilation 实例。
// 它扩展（extends）自 Tapable 类，用来注册和调用插件。
/**
 * Compiler就是编译大管家
 * 负责整个编译过程，里面保存整个编译所有的信息
 */
class Compiler {
  constructor(options) {
    this.options = options
    // https://webpack.js.org/api/compiler-hooks/#run
    // hooks上维护的都是hook,代表编译生命周期的某个节点
    this.hooks = {
      run: new SyncHook(), //在开始编译之前调用
      done: new SyncHook() //在编译完成时执行
    }
  }

  // 4.执行Compiler对象的run方法开始执行编译
  run(callback) {
    // 在编译开始前触发run钩子执行
    this.hooks.run.call()
    const onCompiled = (err, stats, fileDependencies) => {}
    //调用compile方法进行编译
    this.compile(onCompiled)
  }

  // 开启一次新的编译
  compile(callback) {
    // 每次编译 都会创建一个新的Compilation实例
    let compilation = new Compilation(this.options, this)
    // build方法开始编译
    compilation.build(callback)
  }
}
module.exports = Compiler