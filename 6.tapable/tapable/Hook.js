// 9个钩子都可以共享的父类
class Hook {
  constructor(args) {
    this.args = Array.isArray(args) ? args : []; // 形参列表存下来 args =['name','age']
    this.taps = []; // 这里存放回调的信息（tapInfo的数组）
    this.call = CALL_DELEGATE; // 这是代理的CALL方法；先放个假的，真正调用的时候再创建一个新的
    this._x = null; // 存放回调函数的数组
  }

  /**
   *
   * @param {*} options name 可以是对象，也可以是字符串
   * @param {*} fn 回调函数
   */
  tap(options, fn) {
    // 如果通过tap注册的回调，那么类型type = "sync"
    // fn要以同步的方式执行
    this._tap("sync", options, fn);
  }

  /**
   *
   * @param {*} type 注册的tap的类型：'sync' | 'async' | 'promise'
   * @param {*} options name 可以是对象，也可以是字符串
   * @param {*} fn
   */
  _tap(type, options, fn) {
    if (typeof options === "string") {
      // 传个是字符串就给name
      options = {
        name: options,
      };
    }
    // 回调的信息
    const tapInfo = { ...options, type, fn }; // type是回调函数的类型
    // 往taps数组中插入回调的信息对象
    this._insert(tapInfo);
  }

  _insert(tapInfo) {
    this.taps.push(tapInfo);
  }

  // 动态创建call方法
  _createCall(type) {
    // 每个子类的compile都不一致，需要在子类中具体实现
    return this.compile({
      taps: this.taps,
      args: this.args,
      interceptors: this.interceptors,
      type,
    });
  }
}

// call的代理方法，假方法
const CALL_DELEGATE = function (...args) {
  // 动态创建一个sync类型的call方法
  // 重新覆盖this.call
  this.call = this._createCall("sync");
  // 调用新创建的call方法
  return this.call(...args);
};

module.exports = Hook;
