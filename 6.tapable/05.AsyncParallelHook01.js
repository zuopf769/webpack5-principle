let { AsyncParallelHook } = require("tapable");

// 异步并行执行钩子

let queue = new AsyncParallelHook(["name"]);

// tap 同步注册
console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});

queue.callAsync("zhufeng", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
