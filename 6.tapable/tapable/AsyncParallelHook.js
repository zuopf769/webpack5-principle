const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

// 异步并行钩子代码工厂类
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  // 动态创建的新函数的函数内容，具体见HookCodeFactory的create方法
  content({ onDone }) {
    // 异步并发注册的钩子们的执行逻辑就是钩子同时执行全部执行完毕才算执行完毕
    return this.callTapsParallel({ onDone });
  }
}

// 异步并行钩子代码工厂，负责具体的方法创建
const factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook {
  // 动态编译call方法，在每中类型的子hook中具体实现，因为不同的子类call方法的执行逻辑不一样，所以生成的方法也不一样
  compile(options) {
    // 初始化代码工厂 this就是钩子的实例 options选项{taps,args,type}
    factory.setup(this, options);
    // 返回创建好的方法
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;
