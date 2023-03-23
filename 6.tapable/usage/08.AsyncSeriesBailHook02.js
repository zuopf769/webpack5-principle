let { AsyncSeriesBailHook } = require("tapable");

let queue = new AsyncSeriesBailHook(["name"]);

console.time("cost");
queue.tapAsync("1", function (name, callback) {
  setTimeout(function () {
    console.log(1);
    callback("wrong");
  }, 1000);
});
queue.tapAsync("2", function (name, callback) {
  setTimeout(function () {
    console.log(2);
    callback();
  }, 2000);
});
queue.tapAsync("3", function (name, callback) {
  setTimeout(function () {
    console.log(3);
    callback();
  }, 3000);
});

queue.callAsync("zuopf", (err) => {
  console.log(err);
  console.timeEnd("cost");
});
