const path = require("path");
let { SyncHook } = require("tapable");
let async = require("neo-async");
const Chunk = require("./Chunk");
// normalModuleFactory
const NormalModuleFactory = require("./NormalModuleFactory");
// 单例
const normalModuleFactory = new NormalModuleFactory();
// parser
const Parser = require("./Parser");
// 单例
const parser = new Parser();
const ejs = require("ejs");
const fs = require("fs");
// const mainTemplate = fs.readFileSync(
//   path.join(__dirname, "templates", "main.ejs"),
//   "utf8"
// );
const mainTemplate = fs.readFileSync(
  path.join(__dirname, "templates", "asyncMain.ejs"),
  "utf8"
);
// 模板编译
const mainRender = ejs.compile(mainTemplate);
const chunkTemplate = fs.readFileSync(
  path.join(__dirname, "templates", "chunk.ejs"),
  "utf8"
);
const chunkRender = ejs.compile(chunkTemplate);

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
    this.chunks = []; // 这里放着所有代码块
    this.files = []; // 这里放着本次编译所有的产出的文件名
    this.assets = {}; //存放 着生成资源 key是文件名 值是文件的内容

    this.hooks = {
      //当你成功构建完成一个模块后就会触发此钩子执行
      succeedModule: new SyncHook(["module"]),
      seal: new SyncHook(),
      beforeChunks: new SyncHook(),
      afterChunks: new SyncHook(),
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
    this._addModuleChain(context, entry, name, false, (err, module) => {
      finalCallback(err, module);
    });
  }

  _addModuleChain(context, rawRequest, name, async, callback) {
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
        async,
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

  /**
   * 把模块封装成代码块Chunk
   * @param {*} callback
   */
  seal(callback) {
    this.hooks.seal.call(); // seal封装chunk开始
    this.hooks.beforeChunks.call(); // 开始准备生成代码块

    // 一般来说,默认情况下,每一个入口会生成一个代码块
    // 入口文件算一个入口；import()动态导入模块也算一个入口
    for (const entryModule of this.entries) {
      const chunk = new Chunk(entryModule); //根据入口模块得到一个代码块
      this.chunks.push(chunk);
      // 对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.modules.filter(
        (module) => module.name === chunk.name
      );
    }
    this.hooks.afterChunks.call(this.chunks);
    //生成代码块之后,要生成代码块对应资源
    this.createChunkAssets();
    callback();
  }

  createChunkAssets() {
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const file = chunk.name + ".js"; //只是拿到了文件名
      chunk.files.push(file);
      let source;
      if (chunk.async) {
        source = chunkRender({
          chunkName: chunk.name, // ./src/index.js
          modules: chunk.modules, //此代码块对应的模块数组[{moduleId:'./src/index.js'},{moduleId:'./src/title.js'}]
        });
      } else {
        source = mainRender({
          entryModuleId: chunk.entryModule.moduleId, // ./src/index.js
          modules: chunk.modules, //此代码块对应的模块数组[{moduleId:'./src/index.js'},{moduleId:'./src/title.js'}]
        });
      }
      this.emitAssets(file, source);
    }
  }

  emitAssets(file, source) {
    this.assets[file] = source;
    this.files.push(file);
  }
}

module.exports = Compilation;
