let { AsyncParallelHook } = require("tapable");

// 异步并行执行钩子
let queue = new AsyncParallelHook(["name"]);

// tapAsync 异步注册，全部任务完成后执行最终的回调
// 同时一起执行三个hook；三个都执行完一起结束
console.time("cost");

// setTimeout异步钩子需要传入callback手动执行下一个hook
queue.tapAsync("1", function (name, callback) {
  // 同时执行 console.log("setTimeout1");console.log("setTimeout2");console.log("setTimeout3");
  console.log("setTimeout1");
  setTimeout(function () {
    console.log(1);
    callback();
  }, 1000);
});
queue.tapAsync("2", function (name, callback) {
  console.log("setTimeout2");
  setTimeout(function () {
    console.log(2);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, callback) {
  console.log("setTimeout3");
  setTimeout(function () {
    console.log(3);
    callback();
  }, 3000);
});

queue.callAsync("zuopf", (err) => {
  console.log(err);
  // 花费时间是累加
  console.timeEnd("cost");
});
