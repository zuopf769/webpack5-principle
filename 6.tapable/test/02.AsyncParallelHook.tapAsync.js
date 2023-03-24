// const { AsyncParallelHook } = require("tapable");
const { AsyncParallelHook } = require("../tapable");

debugger;

const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");
hook.tapAsync("1", (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    // 只有callback有返回值就会执行最后的回调done，但是剩下的两个钩子的回调仍然会执行
    // 1会被当做error 可以查看src/2.AsyncParallelHook.origin.js
    callback(1);
  }, 1000);
});
hook.tapAsync("2", (name, age, callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});
hook.tapAsync("3", (name, age, callback) => {
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000);
});

hook.callAsync("zuopf", 18, () => {
  console.log("done");
  console.timeEnd("cost");
});
