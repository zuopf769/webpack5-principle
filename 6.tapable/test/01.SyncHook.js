// 原生的
// const { SyncHook } = require("tapable");
// 自己手写的
const { SyncHook } = require("../tapable");

debugger;
const hook = new SyncHook(["name", "age"]);

// 第一个参数可能是个对象
hook.tap({ name: "1" }, (name, age) => {
  console.log(1, name, age);
});
// 第一个参数可能是字符串
hook.tap("2", (name, age) => {
  console.log(2, name, age);
});
hook.tap("3", (name, age) => {
  console.log(3, name, age);
});

hook.call("zuopf", 18);
