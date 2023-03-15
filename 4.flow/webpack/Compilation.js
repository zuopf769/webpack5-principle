const path = require('path')
const fs = require('fs')

const baseDir = normalizePath(process.cwd())
function normalizePath(path) {
  return path.replace(/\\/g, '/')
}

// https://webpack.docschina.org/api/compilation-hooks/
// Compilation 模块会被 Compiler 用来创建新的 compilation 对象（或新的 build 对象）。
// compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。
// 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。
// 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。
class Compilation {
  constructor(options, compiler) {
    this.options = options
    this.compiler = compiler
    this.modules = [] //这里放置本次编译涉及的所有的模块
    this.chunks = [] //本次编译所组装出的代码块
    this.assets = {} //key是文件名,值是文件内容
    this.files = [] //代表本次打包出来的文件
    this.fileDependencies = new Set() //本次编译依赖的文件或者说模块
  }
  // 这个才是编译最核心的方法
  build(callback) {
    // 5.根据配置中的entry找出入口文件
    let entry = {}
    // entry是个语法糖，webpack.config配置文件中可能是字符串，也可能是对象
    // 不管是字符串还是对象都统一处理成对象
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry
    } else {
      entry = this.options.entry
    }

    // entry多入口or单入口都是一个对象
    for (let entryName in entry) {
      // entry的完整路径
      let entryFilePath = path.posix.join(baseDir, entry[entryName])
      this.fileDependencies.add(entryFilePath)
      // console.log(this.fileDependencies)
    }

    callback(
      null, // error
      {
        modules: this.modules,
        chunks: this.chunks,
        assets: this.assets,
        files: this.files
      }, // stats
      this.fileDependencies // fileDependencies
    )
  }
}

module.exports = Compilation
