// 创建具体方法的工厂类
class HookCodeFactory {
  init(options) {
    this.options = options;
  }

  /**
   *
   * @param {*} hookInstance hook实例
   * @param {*} options
   */
  setup(hookInstance, options) {
    // _x 回调函数的数组不是tapInfo的数组了
    hookInstance._x = options.taps.map((tapInfo) => tapInfo.fn);
  }

  // 返回形参列表
  // const hook = new SyncHook(["name", "age"]);
  args() {
    return this.options.args.join(",");
  }

  // 拼接函数 - 头 具体内容见src/1.syncHook.js
  header() {
    let code = ``;
    code += `var _x = this._x;\n`;
    return code;
  }

  // 动态创建一个函数 new Function
  create(options) {
    this.init(options);
    // 拼接函数 具体内容见src/1.syncHook.js
    let fn;
    // 判断你要创建的函数的类型；类型不同函数的执行逻辑不同
    switch (options.type) {
      case "sync": //创建一个同步执行的函数
        // this.args(),形参列表
        // this.header()函数头，具体执行函数逻辑需要的变量啥的
        // this.content()函数体内容，具体需要各个子类实现
        fn = new Function(this.args(), this.header() + this.content());
        break;

      default:
        break;
    }
    // 销毁options
    this.deinit();
    return fn;
  }

  // 每个tap的执行逻辑代码拼接
  callTapsSeries() {
    let code = "";
    for (let j = 0; j < this.options.taps.length; j++) {
      // 每个tap的执行逻辑代码拼接
      const tapContent = this.callTap(j);
      code += tapContent;
    }
    return code;
  }

  deinit() {
    this.options = null;
  }

  // 获取每一个回调它的代码
  callTap(tapIndex) {
    let code = ``;
    // 具体内容见src/1.syncHook.js  var _fn0 = _x[0];
    // _x变量已经在header中加上了
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`; // 取出回调函数的字符串拼接，加上回车放便代码格式化
    let tapInfo = this.options.taps[tapIndex];
    // 不同类型的hook执行钩子回调的逻辑不一样
    switch (tapInfo.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});\n`; // 执行回调函数的字符串拼接
        break;

      default:
        break;
    }

    return code;
  }
}

module.exports = HookCodeFactory;
