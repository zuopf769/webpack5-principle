let { AsyncParallelBailHook } = require("tapable");

let queue = new AsyncParallelBailHook(["name"]);

console.time("cost");

// tapAsync
// 有一个任务返回错误就直接调最终的回调

queue.tapAsync("1", function (name, callback) {
  console.log(1);
  // 有一个任务返回错误就直接调最终的回调
  callback("Wrong");
});
queue.tapAsync("2", function (name, callback) {
  console.log(2);
  callback();
});
queue.tapAsync("3", function (name, callback) {
  console.log(3);
  callback();
});
queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
