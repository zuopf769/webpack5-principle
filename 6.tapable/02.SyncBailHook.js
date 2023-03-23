const { SyncBailHook } = require("tapable");

// 同步保险钩子 - 返回值影响执行流程

/**
 * bail保险、保险丝、熔断
 * BailHook 中的回调函数也是顺序执行的
 * 调用 call 时传入的参数可以传给回调函数
 * 当回调函数返回非 undefined 值的时候会停止调用后续的回调
 */

/**
 * 形参数组
 * 形参的名义没有意义
 */
const hook = new SyncBailHook(["name", "age"]);
/**
 * tap的第一个参数是回调函数的名称，但是这个名字只是给程序员看的
 */
hook.tap("1", (name, age) => {
  // return undefined 继续往下走
  console.log(1, name, age);
});
hook.tap("2", (name, age) => {
  console.log(2, name, age);
  // return 非 undefined 不会走下一个任务，退出
  return "2";
});
// 3不会执行，因为前面的hook返回了不是 undefined 的值
hook.tap("3", (name, age) => {
  console.log(3, name, age);
});

hook.call("zuopf", 18);
