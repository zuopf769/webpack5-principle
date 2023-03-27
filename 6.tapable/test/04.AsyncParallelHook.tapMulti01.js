// const { AsyncParallelHook } = require("tapable");
const { AsyncParallelHook } = require("../tapable");

debugger;

const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");

/**
 * AsyncParallelHook可以同时使用tap、tapAsync、tapPromise来注册
 * 但是会把同步也当做异步来执行
 */

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

// promise来触发钩子执行
// 动态编译生成的函数返回一个promise
hook.promise("zuopf", 18).then(
  () => {
    console.log("done");
    console.timeEnd("cost");
  },
  () => {}
);
