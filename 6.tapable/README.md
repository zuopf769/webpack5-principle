# tapable

## 1. webpack 的插件机制

- 在具体介绍 webpack 内置插件与钩子[可视化工具](https://www.npmjs.com/package/wepback-plugin-visualizer)之前，我们先来了解一下 webpack 中的插件机制。 webpack 实现插件机制的大体方式是：

* 创建 - webpack 在其内部对象上创建各种钩子；
* 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
* 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。

- Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例
- 通过事件和注册和监听，触发 webpack 生命周期中的函数方法

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

## 2. tapable 分类

### 2.1 按同步异步分类

- Hook 类型可以分为同步 Sync 和异步 Async，异步又分为并行和串行

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-50-08-5e4890b1ffccae14b7f9dad3da4f98e5-20230322165007-16501a.png)

### 2.2 按返回值分类

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-51-05-29a89155fccc7f59f58def7e7fe848fc-20230322165105-d73df3.png)

### 2.2.1 Basic

- 执行每一个事件函数，不关心函数的返回值,有 SyncHook、AsyncParallelHook、AsyncSeriesHook

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-57-23-ee333a91b20555959541ee8281d67527-20230322165722-f5e00c.png)

### 2.2.2 Bail 保险

- 执行每一个事件函数，遇到第一个结果 result !== undefined 则返回，不再继续执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook
- 通俗的解释：要不到值就问下家要、要不到就下家接着要，要到了就退出了；某个方法有返回值了，就不再往后要值了，直接退出了

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-56-57-948f7d8f960ec9c10ce077012f0d87c1-20230322165656-ee5a98.png)

### 2.2.3 Waterfall 瀑布

- 如果前一个事件函数的结果 result !== undefined,则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook
- 通俗的解释：上一个函数的结果会做为下一个函数的参数；如果上一个函数没返回值，则下一个函数的参数还是上上个返回的值

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/17-46-56-64b9fa50d063ffc2e2c99b9a8dda1191-20230322174655-b70c6c.png)

### 2.2.4 Loop

- 不停的循环执行事件函数，直到所有函数结果 result === undefined,有 SyncLoopHook 和 AsyncSeriesLoopHook
- 同俗的解释：碰到某个函数返回值不是 undefined 就从头开始循环

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/19-28-19-3ebee1baa5af89e5e6a4c6a481d630d7-20230322192818-ab8376.png)

## 3.使用

usage 目录细

> 01 ~ 09

## 4.SyncHook

tapable 目录下自定义 tapable 的代码

- 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
- 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
- 如果回调函数不接受参数，可以传入空数组
- 在实例化的时候传入的数组长度长度有用，值没有用途
- 执行 call 时，参数个数和实例化时的数组长度有关
- 回调的时候是按先入先出的顺序执行的，先放的先执行

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/27/15-14-29-e59240949e9a4ec45b9548fa4f2b398a-20230327151428-243752.png)

```js
const { SyncHook } = require("./tapable");
let syncHook = new SyncHook(["name", "age"]);
let fn1 = (name, age) => {
  console.log(1, name, age);
};
syncHook.tap({ name: "1" }, fn1);
let fn2 = (name, age) => {
  console.log(2, name, age);
};
syncHook.tap("2", fn2);
syncHook.call("zuopf", 10);

/**
(function anonymous(name, age) {
    var _x = this._x;
    var _fn0 = _x[0];
    _fn0(name, age);
    var _fn1 = _x[1];
    _fn1(name, age);
})
*/
```

## 5.AsyncParallelHook.callAsync

```js
const { AsyncParallelHook } = require("tapable");
const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");

hook.tapAsync("1", (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000);
});
hook.tapAsync("2", (name, age, callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});
hook.tapAsync("3", (name, age, callback) => {
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000);
});
debugger;
hook.callAsync("zuopf", 10, (err) => {
  console.log(err);
  console.timeEnd("cost");
});
/**
(function anonymous(name, age, _callback) {
  var _x = this._x;
  var _counter = 3;
  var _done = function () {
    _callback();
  };
  var _fn0 = _x[0];
  _fn0(name, age, function (_err0) {
    if (--_counter === 0) _done();
  });
  var _fn1 = _x[1];
  _fn1(name, age, function (_err1) {
    if (--_counter === 0) _done();
  });
  var _fn2 = _x[2];
  _fn2(name, age, function (_err2) {
    if (--_counter === 0) _done();
  });
});
 */
```

## 6.AsyncParallelHook.callPromise

```js
//let { AsyncParallelHook } = require("tapable");
let { AsyncParallelHook } = require("./tapable2");
let queue = new AsyncParallelHook(["name", "age"]);
console.time("cost");
queue.tapPromise("1", function (name, age) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(1, name, age);
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name, age) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(2, name, age);
      resolve();
    }, 2000);
  });
});
queue.tapPromise("3", function (name, age) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});
queue.promise("zuopf", 10).then(
  (result) => {
    console.timeEnd("cost");
  },
  (error) => {
    console.log(error);
    console.timeEnd("cost");
  }
);
/**
 (function anonymous(name, age) {
    var _x = this._x;
    return new Promise(function (_resolve, _reject) {
        var _counter = 3;
        var _done = function () {
            _resolve();
        };

        var _fn0 = _x[0];
        var _promise0 = _fn0(name, age);
        _promise0.then(
            function () {
                if (--_counter === 0) _done();
            }
        );

        var _fn1 = _x[1];
        var _promise1 = _fn1(name, age);
        _promise1.then(
            function () {
                if (--_counter === 0) _done();
            }
        );

        var _fn2 = _x[2];
        var _promise2 = _fn0(name, age);
        _promise2.then(
            function () {
                if (--_counter === 0) _done();
            }
        );
    });
});
 */
```

## 7. interceptor

- 所有钩子都提供额外的拦截器 API
  - call:(...args) => void 当你的钩子触发之前,(就是 call()之前),就会触发这个函数,你可以访问钩子的参数.多个钩子执行一次
  - tap: (tap: Tap) => void 每个钩子执行之前(多个钩子执行多个),就会触发这个函数
  - register:(tap: Tap) => Tap | undefined 每添加一个 Tap 都会触发 你 interceptor 上的 register,你下一个拦截器的 register 函数得到的参数 取决于你上一个 register 返回的值,所以你最好返回一个 tap 钩子.
- Context(上下文) 插件和拦截器都可以选择加入一个可选的 context 对象, 这个可以被用于传递随意的值到队列中的插件和拦截器

```js
const { SyncHook } = require("tapable");
const syncHook = new SyncHook(["name", "age"]);
syncHook.intercept({
  register: (tapInfo) => {
    //当你新注册一个回调函数的时候触发
    console.log(`拦截器1开始register`);
    return tapInfo;
  },
  tap: (tapInfo) => {
    //每个回调函数都会触发一次
    console.log(`拦截器1开始tap`);
  },
  call: (name, age) => {
    //每个call触发，所有的回调只会总共触发一次
    console.log(`拦截器1开始call`, name, age);
  },
});
syncHook.intercept({
  register: (tapInfo) => {
    //当你新注册一个回调函数的时候触发
    console.log(`拦截器2开始register`);
    return tapInfo;
  },
  tap: (tapInfo) => {
    //每个回调函数都会触发一次
    console.log(`拦截器2开始tap`);
  },
  call: (name, age) => {
    //每个call触发，所有的回调只会总共触发一次
    console.log(`拦截器2开始call`, name, age);
  },
});

syncHook.tap({ name: "回调函数A" }, (name, age) => {
  console.log(`回调A`, name, age);
});
//console.log(syncHook.taps[0]);
syncHook.tap({ name: "回调函数B" }, (name, age) => {
  console.log("回调B", name, age);
});
debugger;
syncHook.call("zuopf", 10);

/**
拦截器1开始register
拦截器2开始register
拦截器1开始register
拦截器2开始register

拦截器1开始call zuopf 10
拦截器2开始call zuopf 10

拦截器1开始tap
拦截器2开始tap
回调A zuopf 10

拦截器1开始tap
拦截器2开始tap
回调B zuopf 10
*/
```

## 8. stage

```js
let { SyncHook } = require("tapable");
let hook = new SyncHook(["name"]);
debugger;
hook.tap({ name: "tap1", stage: 1 }, (name) => {
  console.log(1, name);
});
hook.tap({ name: "tap3", stage: 3 }, (name) => {
  console.log(3, name);
});
hook.tap({ name: "tap5", stage: 5 }, (name) => {
  console.log(4, name);
});
hook.tap({ name: "tap2", stage: 2 }, (name) => {
  console.log(2, name);
});

hook.call("zuopf");
```

## 9. before

```js
let { SyncHook } = require("tapable");
let hook = new SyncHook(["name"]);
debugger;
hook.tap({ name: "tap1" }, (name) => {
  console.log(1, name);
});
hook.tap({ name: "tap3" }, (name) => {
  console.log(3, name);
});
hook.tap({ name: "tap5" }, (name) => {
  console.log(4, name);
});
hook.tap({ name: "tap2", before: ["tap3", "tap5"] }, (name) => {
  console.log(2, name);
});

hook.call("zuopf");
```

## HookMap

A HookMap is a helper class for a Map with Hooks

```js
let { SyncHook, HookMap } = require("./tapable");
const keyedHookMap = new HookMap(() => new SyncHook(["name"]));
keyedHookMap.for("key1").tap("plugin1", (name) => {
  console.log(1, name);
});
keyedHookMap.for("key1").tap("plugin2", (name) => {
  console.log(2, name);
});
const hook1 = keyedHookMap.get("key1");
hook1.call("zuopf");
```
