const { SyncHook } = require("../tapable");

const syncHook = new SyncHook(["name", "age"]);

// tap的第一个参数允许是一个对象
// 如果不加stage，默认状态taps按注册的顺序执行
// stage阶段，执行阶段
// stage值越小表示越优先执行
syncHook.tap({ name: "tap1", stage: 1 }, () => {
  console.log("tap1");
});

syncHook.tap({ name: "tap3", stage: 3 }, () => {
  console.log("tap3");
});

syncHook.tap({ name: "tap5", stage: 5 }, () => {
  console.log("tap5");
});

// 可以使用stage来改变默认的按顺序执行的逻辑
syncHook.tap({ name: "tap2", stage: 2 }, () => {
  console.log("tap2");
});

syncHook.call("zuopf", 14);
