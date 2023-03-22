const { SyncWaterfallHook } = require("tapable");
/**
 * 形参数组
 * 形参的名义没有意义
 */
const hook = new SyncWaterfallHook(["name", "age"]);
/**
 * tap的第一个参数是回调函数的名称，但是这个名字只是给程序员看的
 */
hook.tap("1", (name, age) => {
  console.log(1, name, age);
  return "result1";
});
hook.tap("2", (name, age) => {
  console.log(2, name, age);
  return "result2";
});
hook.tap("3", (name, age) => {
  console.log(3, name, age);
});
hook.tap("4", (name, age) => {
  console.log(4, name, age);
});
hook.tap("5", (name, age) => {
  console.log(5, name, age);
});
hook.call("zuopf", 18);
