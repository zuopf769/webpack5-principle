let { AsyncParallelHook } = require("tapable");

// 异步并行执行钩子
let queue = new AsyncParallelHook(["name"]);

// tapPromise注册 - 需要返回promise，不需要callback
// promise 注册钩子
// 全部完成后执行才算成功

console.time("cost");
queue.tapPromise("1", function (name) {
  // 同时执行 console.log("promise1");console.log("promise2");console.log("promise3");
  console.log("promise1");
  // tapPromise注册方式，需要返回Promise
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(1);
      // 不需要传入callback，只需要resolve或者reject
      resolve();
    }, 1000);
  });
});
queue.tapPromise("2", function (name) {
  console.log("promise2");
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(2);
      // resolve();
      reject("err in 2");
    }, 2000);
  });
});
queue.tapPromise("3", function (name) {
  console.log("promise3");
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(3);
      resolve();
    }, 3000);
  });
});

// 只能通过promise触发执行，没有callPromise
queue.promise("zuopf").then(
  () => {
    console.log("success");
    // 一起结束，时间累加约3秒
    console.timeEnd("cost");
  },
  (err) => {
    console.log("err");
    console.log(err);
  }
);
