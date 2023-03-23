const { SyncHook } = require("tapable");

// 同步钩子 - 返回值不起作用，不会传给下个钩子的回调，也不会影响钩子的执行流程
/**
 * 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
 * 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
 * 如果回调函数不接受参数，可以传入空数组
 * 在实例化的时候传入的数组长度长度有用，字符串的值没有用途
 * 执行 call 时，参数个数和实例化时的数组长度有关，传多了的话就不会接收到多的参数
 * 回调的时候是按先入先出的顺序执行的，先放的先执行
 */

// 创建钩子
/**
 * 形参数组
 * 形参的名称没有意义，写成xx,yy也可以
 * 形参的个数有用，如果定义2个形参，调用的时候传的个数多于形参的个数后就接收不到多的参数
 */
const hook = new SyncHook(["name", "age"]);
// const hook = new SyncHook(["xx", "yy"]);

// 注册钩子
/**
 * tap的第一个参数是回调函数的名称，但是这个名字只是给程序员看的
 */
hook.tap("1", (name, age, country) => {
  // 创建钩子的时候没有定义第三个参数，参数的个数是两个，所以第三个参数接收不到
  console.log(1, name, age, country);
  // SyncHook中某一个有返回值，这个返回值也会被忽略，不会传给下个钩子
  return 1;
});
hook.tap("2", (name, age, country) => {
  console.log(2, name, age, country);
  // SyncHook中返回值不会被接收，也不会影响执行流程
  return 2;
});
hook.tap("3", (name, age, country) => {
  // SyncHook中返回值不会被接收，也不会影响执行流程
  console.log(3, name, age, country);
  return 3;
});

// 调用钩子、触发钩子
// hook.call("zuopf", 10, "china");
// 也可以不传参数
hook.call();

// 展示创建、注册、调用的可视化工具：
// 一个用来展示webpack内置插件调用关系（钩子）的小工具。
// 也许可以用来帮助理清webpack内部插件之间的关系，促进webpack源码结构的理解与阅读。
// 支持webpack5
// https://alienzhou.github.io/webpack-internal-plugin-relation/
