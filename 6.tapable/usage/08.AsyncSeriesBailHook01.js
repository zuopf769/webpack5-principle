let { AsyncSeriesBailHook } = require("tapable");

// 异步串行保险钩子

// 只要有一个返回了不为 undefined 的值就直接结束；后面的钩子不会执行

let queue = new AsyncSeriesBailHook(["name"]);

console.time("cost");
queue.tap("1", function (name) {
  console.log(1);
  return "Wrong";
});
queue.tap("2", function (name) {
  console.log(2);
});
queue.tap("3", function (name) {
  console.log(3);
});

queue.callAsync("zuopf", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
