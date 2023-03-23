const { SyncWaterfallHook } = require("tapable");

// SyncWaterfallHook 同步瀑布钩子 - 返回值会传递，不会停止回调栈的调用

/**
 * SyncWaterfallHook 表示如果上一个回调函数的结果不为 undefined,则可以作为下一个回调函数的第一个参数
 * 回调函数接受的参数来自于上一个函数的结果
 * 调用 call 传入的第一个参数，会被上一个函数的非 undefined 结果替换
 * 当回调函数返回非 undefined 不会停止回调栈的调用
 */

// 创建
/**
 * 形参数组
 * 形参的名义没有意义
 */
const hook = new SyncWaterfallHook(["name", "age"]);

// 注册
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

// 执行
hook.call("zuopf", 18);
