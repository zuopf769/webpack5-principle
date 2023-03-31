// vite webpack构建速度提升的手段：缓存、懒编译、并行编译
// AsyncQueue 可以实现并行执行任务
// webpack内部任务的并发控制或者说管理工具是AsyncQueue
const AsyncQueue = require("webpack/lib/util/AsyncQueue");

function processor(module, callback) {
  //异步是模拟异步创建模块的过程
  setTimeout(() => {
    console.log("process ", module);
    callback(null, { ...module, content: module.key + "内容" });
  }, 3000);
}

const getKey = (module) => module.key;

let queue = new AsyncQueue({
  name: "创建模块的队列",
  processor,
  getKey,
  parallelism: 3,
});

const start = Date.now();
queue.add({ key: "module1" }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: "module2" }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: "module3" }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: "module4" }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: "module5" }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: "module1" }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
