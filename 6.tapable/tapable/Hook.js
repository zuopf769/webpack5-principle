// 9个钩子都可以共享的父类
class Hook {
  constructor(args) {
    this.args = Array.isArray(args) ? args : []; // 形参列表存下来 args =['name','age']
    this.taps = []; // 这里存放回调的信息（tapInfo的数组）
    this.call = CALL_DELEGATE; // 这是代理的call方法；先放个假的，真正调用的时候再创建一个新的
    this.callAsync = CALL_ASYNC_DELEGATE; // 这是代理的callAsync方法；先放个假的，真正调用的时候再创建一个新的
    this.promise = PROMISE_DELEGATE; // 这是代理的promise方法；先放个假的，真正调用的时候再创建一个新的
    this.interceptors = []; // 拦截器
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

  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }

  tapPromise(options, fn) {
    this._tap("promise", options, fn);
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
    let tapInfo = { ...options, type, fn }; // type是回调函数的类型
    // 调用Interceptors的register函数
    tapInfo = this.runRegisterInterceptors(tapInfo);
    // 往taps数组中插入回调的信息对象
    this._insert(tapInfo);
  }

  // 调用所有的Interceptors的register函数
  runRegisterInterceptors(tapInfo) {
    // 可以同时写多个interceptors
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        // register方法就是注册钩子的时候执行如： 使用tap注册一个同步钩子的时候就执行一次
        let newTapInfo = interceptor.register(tapInfo);
        // 如果register返回tapInfo
        if (newTapInfo) {
          tapInfo = newTapInfo;
        }
      }
    }
    return tapInfo;
  }

  // 注册intercept
  intercept(interceptor) {
    this.interceptors.push(interceptor);
  }

  _insert(tapInfo) {
    // 每次tap/tapAsync注册新的钩子后，都需要重置this.callAsync和this.call，
    // 让其能重新编译生成的方法把最新注册的方法加到执行逻辑里面
    this.resetCompilation();
    // 默认是按注册的顺序存放和执行
    // this.taps.push(tapInfo);

    // before，可以改变tap钩子的执行顺序
    // before最后是个数组，兼容字符串和数组
    let before;
    if (typeof tapInfo.before === "string") {
      before = new Set([tapInfo.before]);
    } else if (Array.isArray(tapInfo.before)) {
      // 用set就是为了去重
      before = new Set(tapInfo.before);
    }

    // tap的阶段值，可以改变tap钩子的执行顺序
    let stage = 0;
    if (typeof tapInfo.stage === "number") {
      stage = tapInfo.stage; //新注册的回调 tapInfo的阶段值
    }

    // 插入排序，保证stage值小的在前面
    // 从后往前对比排序，为什么不采用从前往后对比排序？因为目前已经是排好序的，从后面开始往前数组移动的数据比较少
    let i = this.taps.length;
    while (i > 0) {
      // --是为了取出原来的tap
      i--;
      const x = this.taps[i];
      // 数组容量+1扩容
      this.taps[i + 1] = x;

      // 找到要插入到的tap之前
      if (before) {
        if (before.has(x.name)) {
          // 找到了就删除before中的那个tap，因为指针会往前
          before.delete(x.name); // 已经超过了x.name比如tap3
          // 继续找要放在其前面的tap
          continue;
        }
        if (before.size > 0) {
          // size > 0 说明还没有超越所有想超越的回调
          // size == 0 就表明你想超越的都已经超越了
          continue;
        }
      }

      // 找到比当前的stage阶段小的tap，插入到他的后面
      const xStage = x.stage || 0;
      if (xStage > stage) {
        //如果当前值比要插入的值要大，继续
        continue;
      }
      // 找到比他小的tap后，就退出循环放在他的后面
      // 所以如果stage阶段值相同，先注册的先执行
      i++;
      break;
    }
    // 第一次注册的时候，以及插入排序
    this.taps[i] = tapInfo;
  }

  // 重置编译生成的call方法，避免缓存，让其每次调用都能编译出来最新的方法
  resetCompilation() {
    this.call = CALL_DELEGATE; //这是代理的CALL方法
    this.callAsync = CALL_ASYNC_DELEGATE;
  }

  // 动态创建call方法
  _createCall(type) {
    // 每个子类的compile都不一致，需要在子类中具体实现
    return this.compile({
      taps: this.taps,
      args: this.args,
      interceptors: this.interceptors, // 传递注册的拦截器
      type,
    });
  }
}

// call的代理方法，假方法，用的时候才会动态创建一个
const CALL_DELEGATE = function (...args) {
  // 动态创建一个sync类型的call方法
  // 重新覆盖this.call
  this.call = this._createCall("sync");
  // 调用新创建的call方法，返回结果
  return this.call(...args);
};

// 懒编译，真正用的时候才去动态编译创建新的方法
// call的代理方法，假方法
const CALL_ASYNC_DELEGATE = function (...args) {
  // 动态创建一个async类型的call方法
  // 重新覆盖this.callAsync
  // 执行过一次后this.callAsync已经有值了，所以会直接调用这里的，就会导致不重新编译了，所以源码中需要重置为CALL_ASYNC_DELEGATE
  // 让其第二次调用this.callAsync的重新走CALL_ASYNC_DELEGATE方法，重新编译，就能把新注册的方法添加进来了
  this.callAsync = this._createCall("async");
  // 调用新创建的callAsync方法，返回结果
  return this.callAsync(...args);
};

const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  // 调用新创建的promise方法，返回结果
  return this.promise(...args);
};

module.exports = Hook;
