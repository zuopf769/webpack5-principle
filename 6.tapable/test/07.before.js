let { SyncHook } = require("tapable");

let hook = new SyncHook(["name"]);

debugger;
hook.tap({ name: "tap1" }, (name) => {
  console.log(1, name);
});
hook.tap({ name: "tap3" }, (name) => {
  console.log(3, name);
});
hook.tap({ name: "tap5" }, (name) => {
  console.log(4, name);
});

// before可以是字符串和数组
// before存了一个名字的数组，我要放到tap3和tap5的前面
// 不用考虑stage，反正就要放到你们两个的前面，bi你们先执行
hook.tap({ name: "tap2", before: ["tap3", "tap5"] }, (name) => {
  console.log(2, name);
});

hook.call("zuopf");
