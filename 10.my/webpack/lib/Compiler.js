const { AsyncSeriesHook } = require("tapable");

class Compiler {
  constructor(context) {
    this.context = context;
    this.hooks = {
      done: new AsyncSeriesHook(["stats"]), //所有的编译全部都完成
    };
  }

  //run方法是开始编译的入口
  run(callback) {
    console.log("Compiler run");
    callback(null, {
      toJson() {
        return {
          entries: true,
          chunks: true,
          modules: true,
          assets: true,
        };
      },
    });
  }
}

module.exports = Compiler;
