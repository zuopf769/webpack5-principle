let { AsyncSeriesWaterfallHook } = require("tapable");

let queue = new AsyncSeriesWaterfallHook(["name", "age"]);

console.time("cost");
queue.tapAsync("1", function (name, age, callback) {
  setTimeout(function () {
    console.log(1, name, age);
    callback(null, 1);
  }, 1000);
});
queue.tapAsync("2", function (data, age, callback) {
  setTimeout(function () {
    console.log(2, data, age);
    callback(null, 2);
  }, 2000);
});
queue.tapAsync("3", function (data, age, callback) {
  setTimeout(function () {
    console.log(3, data, age);
    callback(null, 3);
  }, 3000);
});

queue.callAsync("zuopf", 10, (err, data) => {
  console.log(err, data);
  console.timeEnd("cost");
});
