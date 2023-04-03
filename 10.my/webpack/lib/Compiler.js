const {
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");
const Compilation = require("./Compilation");
const NormalModuleFactory = require("./NormalModuleFactory");

class Compiler {
  constructor(context) {
    this.context = context; //设置上下文路径
    this.hooks = {
      // 钩子有两个参数
      // context项目根目录的绝对路径 C:\aproject\xxx\webpack\8.my
      // entry入口文件路径 ./src/index.js
      entryOption: new SyncBailHook(["context", "entry"]),
      beforeRun: new AsyncSeriesHook(["compiler"]), //运行前
      run: new AsyncSeriesHook(["compiler"]), //运行
      beforeCompile: new AsyncSeriesHook(["params"]), //编译前
      compile: new SyncHook(["params"]), //编译
      make: new AsyncParallelHook(["compilation"]), //make构建
      thisCompilation: new SyncHook(["compilation", "params"]), //开始一次新的编译
      compilation: new SyncHook(["compilation", "params"]), //创建完成一个新的compilation
      afterCompile: new AsyncSeriesHook(["compilation"]), //编译完成
      emit: new AsyncSeriesHook(["compilation"]), // 发射或者说写入
      done: new AsyncSeriesHook(["stats"]), //所有的编译全部都完成
    };
  }

  // run方法是开始编译的入口
  run(callback) {
    console.log("Compiler run");

    // 编译完成最终的回调函数
    const finalCallback = (err, stats) => {
      callback(err, stats);
    };

    const onCompiled = (err, compilation) => {
      console.log("onCompiled");
      // TODO 创建stats对象
      let stats = {
        toJson() {
          return {
            entries: [], // 显示所有的入口
            chunks: [], // 显示所有的代码块
            modules: [], // 显示所有模块
            assets: [], // 显示所有打包后的资源，也就是文件
          };
        },
      };
      finalCallback(err, stats);
    };

    // 触发beforeRun钩子，返回Compiler的实例对象
    this.hooks.beforeRun.callAsync(this, (err) => {
      // 触发run钩子，返回Compiler的实例对象
      this.hooks.run.callAsync(this, (err) => {
        // 开启真正的编译compile
        this.compile(onCompiled);
      });
    });
  }

  compile(onCompiled) {
    const params = this.newCompilationParams();
    // 触发beforeCompile钩子
    this.hooks.beforeCompile.callAsync(params, (err) => {
      // 触发compile钩子
      this.hooks.compile.call(params);
      // 创建一个新compilation对象
      const compilation = this.newCompilation(params);
      // 触发make钩子的回调函数执行
      // make钩子时在lib/SingleEntryPlugin.js文件中注册的
      this.hooks.make.callAsync(compilation, (err) => {
        onCompiled(err, compilation);
      });
    });
  }

  createCompilation() {
    return new Compilation(this);
  }

  newCompilation(params) {
    const compilation = this.createCompilation();
    this.hooks.thisCompilation.call(compilation, params);
    // 触发完thisCompilation钩子后马上触发compilation钩子
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }

  newCompilationParams() {
    const params = {
      // 在创建compilation这前已经创建了一个普通模块工厂
      normalModuleFactory: new NormalModuleFactory(), //TODO
    };
    return params;
  }
}

module.exports = Compiler;
