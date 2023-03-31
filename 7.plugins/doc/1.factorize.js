const { AsyncSeriesBailHook } = require("tapable");

// 异步串行保险钩子 - 碰到返回值不为undefined就退出后续的钩子的执行
const factorize = new AsyncSeriesBailHook(["resolveData"]);

// 生成外部模块的工厂函数，如果返回外部模块，就不会走后面生成正常钩子的工厂函数了
// exteral plugin的原理就是如果遇到extral的模块，那么就不会走后面的正常逻辑的钩子了
factorize.tapAsync("externalModuleFactory", (resolveData, callback) => {
  // 如果传递了jquery，则会返回外部模块，因为保险钩子的特性，就不会执行后面的钩子了，只会执行到externalModuleFactory
  if (resolveData === "jquery") {
    let externalModule = {
      id: resolveData,
      type: "外部模块",
      source: "window.$",
    };
    // 第一个参数是err异常，第二个参数可以传递给下一个钩子的回调
    callback(null, externalModule);
  } else {
    // 没有返回值，就接着执行后的钩子回调
    callback(null);
  }
});

// 生成正常模块的工厂函数最后一个工厂函数了；例如把jquery从node_moudule里面打包读取过来，打包成一个模块
// 最后总得返回一个模块吧 switch case default
factorize.tapAsync("normalModuleFactory", (resolveData, callback) => {
  let normalModule = {
    id: resolveData,
    type: "正常模块",
    source: "正常打包的内容",
  };
  callback(null, normalModule);
});

// 如果传递了jquery，则只会执行到externalModuleFactory
factorize.callAsync("jquery", (err, module) => {
  console.log(module);
});
