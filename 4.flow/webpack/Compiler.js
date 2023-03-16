const path = require('path')
const fs = require('fs')
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
    /**
     *
     * @param {*} err
     * @param {*} stats stats代表统计结果对象 modules chunks files=bundle assets指的是文件名和文件内容的关系
     * @param {*} fileDependencies 依赖的文件路径
     */
    const onCompiled = (err, stats, fileDependencies) => {
      // 10 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
      for (let filename in stats.assets) {
        let filePath = path.join(this.options.output.path, filename)
        fs.writeFileSync(filePath, stats.assets[filename], 'utf8')
      }
      // 执行Compiler实例run方法的回调
      callback(err, { toJson: () => stats })
      // 在编译的过程中会收集所有的依赖的模块或者说文件
      for (let fileDependency of fileDependencies) {
        // 监听依赖的文件变化，如果依赖的文件变化后会开启一次新的编译
        // 在webpack5之前，会全部重新编译，比较慢，所以需要各种cache插件: HardSourcePlugin dllplugin
        // webpack5，内置了这些缓存只会重新编译变化的文件，没有变化的文件直接从缓存中获取
        // https://webpack.docschina.org/configuration/cache/#root
        fs.watch(fileDependency, () => this.compile(onCompiled))
      }
      // 在编译完成时触发done的钩子，相应插件的done钩子里面都只执行
      this.hooks.done.call()
    }
    //调用compile方法进行编译
    this.compile(onCompiled)
  }

  // 开启一次新的编译
  compile(callback) {
    // 每次编译 都会创建一个新的Compilation实例，而Compiler只有一个实例，这就是Compilation和Compiler的区别
    let compilation = new Compilation(this.options, this)
    // build方法开始编译
    compilation.build(callback)
  }
}

module.exports = Compiler
