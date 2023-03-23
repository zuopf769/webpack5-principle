const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

// 同步钩子代码工厂类
class SyncHookCodeFactory extends HookCodeFactory {
  // 动态创建的新函数的函数内容，具体见HookCodeFactory的create方法
  content() {
    // 同步注册的钩子们的执行逻辑就是一个一个的执行
    return this.callTapsSeries();
  }
}

// 同步钩子代码工厂，负责具体的方法创建
const factory = new SyncHookCodeFactory();
class SyncHook extends Hook {
  // 动态编译call方法，在每中类型的子hook中具体实现，因为不同的子类call方法的执行逻辑不一样，所以生成的方法也不一样
  compile(options) {
    // 初始化代码工厂 this就是钩子的实例 options选项{taps,args,type}
    factory.setup(this, options);
    // 返回创建好的方法
    return factory.create(options);
  }
}

module.exports = SyncHook;
