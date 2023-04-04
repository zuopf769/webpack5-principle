const path = require("path");
let { SyncHook } = require("tapable");
// normalModuleFactory
const NormalModuleFactory = require("./NormalModuleFactory");
const normalModuleFactory = new NormalModuleFactory();
// parser
const Parser = require("./Parser");
const parser = new Parser();

class Compilation {
  constructor(compiler) {
    this.compiler = compiler; // 编译器对象
    this.options = compiler.options; // 选项一样
    this.context = compiler.context; // 根目录
    this.inputFileSystem = compiler.inputFileSystem; //读取文件模块fs
    this.outputFileSystem = compiler.outputFileSystem; //写入文件的模块fs
    this.entries = []; // 入口模块的数组,这里放着所有的入口模块
    this.modules = []; // 模块的数组,这里放着所有的模块

    this.hooks = {
      //当你成功构建完成一个模块后就会触发此钩子执行
      succeedModule: new SyncHook(["module"]),
    };
  }

  /**
   * 开始编译一个新的入口
   * @param {*} context  根目录
   * @param {*} entry 入口模块的相对路径 ./src/index.js
   * @param {*} name 入口的名字 main
   * @param {*} callback 编译完成的回调
   */
  addEntry(context, entry, name, finalCallback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      finalCallback(err, module);
    });
  }

  _addModuleChain(context, rawRequest, name, callback) {
    // 创建模块
    let module = normalModuleFactory.create({
      name,
      context, // 根目录
      rawRequest, // 入口的相对路径 ./src/index.js
      resource: path.posix.join(context, rawRequest), // 入口的绝对路径
      parser,
    });
    this.entries.push(module); //给入口模块数组添加一个模块
    this.modules.push(module); //给普通模块数组添加一个模块

    const afterBuild = (err, module) => {
      // 处理依赖
      return callback(err, module);
    };
    // 编译模块
    this.buildModule(module, afterBuild);
  }

  /**
   * 编译模块
   * @param {*} module 要编译的模块
   * @param {*} afterBuild 编译完成后的后的回调
   */
  buildModule(module, afterBuild) {
    // 模块的真正的编译逻辑其实是放在module内部完成
    module.build(this, (err) => {
      // 走到这里意味着一个module模块已经编译完成了
      afterBuild(err, module);
    });
  }
}

module.exports = Compilation;
