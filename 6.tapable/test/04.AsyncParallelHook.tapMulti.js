// const { AsyncParallelHook } = require("tapable");
const { AsyncParallelHook } = require("../tapable");

debugger;

const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");

/**
 * AsyncParallelHook可以同时使用tap（同步）、tapAsync（setTimeout异步）、tapPromise（Promise异步）来注册
 * 但是会把同步也当做异步来执行
 */

// 可以同时注册同步钩子和异步钩子么？可以
// 如果注册的同时有同步和异步，只能通过异步处理
// 同步如果当做异步来处理呢：同步会立即执行完成Dnoe

// 使用tap来注册同步回调
// 会把同步也当做异步来执行
/**
 *
 * var _fn0 = _x[0];
 * _fn0(name, age);
 * // 执行完同步函数需要判断是是否注册的钩子全都执行完毕，因为可能只注册一个同步钩子
 * if (--_counter === 0) _done();
 *
 */
hook.tap("1", (name, age) => {
  console.log("tap");
  console.log(1, name, age);
});

// 使用tapAsync来注册异步回调
hook.tapAsync("2", (name, age, callback) => {
  console.log("setTimeout");
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});

// 使用tapPromise在注册异步回调
hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    console.log("promise");
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});

// callAsync来触发钩子执行
// 判断回调的个数来执行callback
hook.callAsync("zuopf", 18, (err) => {
  console.log(err);
  // 花费时间是累加
  console.timeEnd("cost");
});
