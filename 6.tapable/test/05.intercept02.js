const { SyncHook } = require("../tapable");
// 形参的name
const syncHook = new SyncHook(["name", "age"]);

// 可以注册多个拦截器

// 注册第一个拦截器
syncHook.intercept({
  register(tapInfo) {
    // 当你新注册一个回调函数的时候触发
    console.log("拦截器1开始register", tapInfo.name);
    // 也可以返回新的tapInfo
  },
  call(name, age) {
    // 每个回调函数执行的时候都会触发一次
    console.log(`拦截器1开始call`, name, age);
  },
  tap() {
    // 每个call触发，所有的回调只会总共触发一次
    console.log(`拦截器1开始tap`);
  },
});

// 注册第二个拦截器
syncHook.intercept({
  register(tapInfo) {
    // 当你新注册一个回调函数的时候触发
    console.log("拦截器2开始register", tapInfo.name);
  },
  call(name, age) {
    // 每个回调函数执行的时候都会触发一次
    console.log(`拦截器2开始call`, name, age);
  },
  tap() {
    // 每个call触发，所有的回调只会总共触发一次
    console.log(`拦截器2开始tap`);
  },
});

syncHook.tap("回调1", (name, age) => {
  console.log("回调1", name, age);
});
syncHook.tap("回调2", (name, age) => {
  console.log("回调2", name, age);
});

debugger;
syncHook.call("zuopf", 14);
