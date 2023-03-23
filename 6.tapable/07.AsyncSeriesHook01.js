let { AsyncSeriesHook } = require("tapable");

let queue = new AsyncSeriesHook(["name"]);

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
