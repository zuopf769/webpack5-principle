const path = require("path");
let { SyncHook } = require("tapable");
let async = require("neo-async");
// normalModuleFactory
const NormalModuleFactory = require("./NormalModuleFactory");
// 单例
const normalModuleFactory = new NormalModuleFactory();
// parser
const Parser = require("./Parser");
// 单例
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
    this._modules = {}; // key是模块ID ,值是模块对象

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
    this.createModule(
      {
        name,
        context,
        rawRequest,
        parser,
        resource: path.posix.join(context, rawRequest),
        moduleId:
          "./" +
          path.posix.relative(context, path.posix.join(context, rawRequest)),
      },
      (entryModule) => this.entries.push(entryModule),
      callback
    );
  }

  /**
   * 创建并编译一个模块
   * @param {*} data 要编译的模块信息
   * @param {*} addEntry  可选的增加入口的方法 如果这个模块是入口模块,如果不是的话,就什么不做
   * @param {*} callback 编译完成后可以调用callback回调
   */
  createModule(data, addEntry, callback) {
    // 通过模块工厂创建一个模块
    let module = normalModuleFactory.create(data);
    addEntry && addEntry(module); // 如果是入口模块,则添加入口里去
    //if(!this._modules[module.moduleId]){//如果_modules里有模块了,不要再放了.
    this.modules.push(module); // 给普通模块数组添加一个模块，不管是入口还是依赖模块都需要push
    this._modules[module.moduleId] = module;
    //}
    const afterBuild = (err, module) => {
      // 如果大于0,说明有依赖
      if (module.dependencies.length > 0) {
        // 递归处理编译模块依赖
        this.processModuleDependencies(module, (err) => {
          callback(err, module);
        });
      } else {
        callback(err, module);
      }
    };
    this.buildModule(module, afterBuild);
  }

  /**
   * 处理编译模块依赖
   * @param {*} module ./src/index.js
   * @param {*} callback
   */
  processModuleDependencies(module, callback) {
    // 1.获取当前模块的依赖模块
    let dependencies = module.dependencies;
    // 遍历依赖模块,全部开始编译,当所有的依赖模块全部编译完成后才调用callback
    async.forEach(
      dependencies,
      (dependency, done) => {
        let { name, context, rawRequest, resource, moduleId } = dependency;
        this.createModule(
          {
            name,
            context,
            rawRequest,
            parser,
            resource,
            moduleId,
          },
          null,
          done
        );
      },
      callback
    );
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
