const { AsyncSeriesBailHook } = require("tapable");

const factorize = new AsyncSeriesBailHook(["resolveData"]);

//最后总得返回一个模块吧 switch case default
factorize.tapAsync("externalModuleFactory", (resolveData, callback) => {
  if (resolveData === "jquery") {
    let externalModule = {
      id: resolveData,
      type: "外部模块",
      source: "window.$",
    };
    callback(null, externalModule);
  } else {
    callback(null);
  }
});

//生成正常模块的工厂函数最后一个工厂函数了
factorize.tapAsync("normalModuleFactory", (resolveData, callback) => {
  let normalModule = {
    id: resolveData,
    type: "正常模块",
    source: "正常打包的内容",
  };
  callback(null, normalModule);
});

// 因为这里传的参数是lodash，所以在externalModuleFactory构造中，不会处理返回了undefined，所以还是会继续执行正常模块的工厂函数
// 最终就会把lodash模块
factorize.callAsync("lodash", (err, module) => {
  console.log(module);
});
