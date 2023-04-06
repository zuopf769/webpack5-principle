let async = require("neo-async");

let arr = [1, 2, 3];
console.time("const");

// 同时开始执行多个任务，全都执行完毕次啊会执行finalCallback
async.each(
  arr,
  (item, done) => {
    setTimeout(() => {
      console.log(item);
      done();
    }, 1000 * item);
  },
  () => {
    console.timeEnd("const");
  }
);
