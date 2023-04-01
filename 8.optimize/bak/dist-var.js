// 全局变量
var calculator;
(() => {
  var webpackModules = {
    "./src/index.js": (module) => {
      module.exports = {
        add(a, b) {
          return a + b;
        },
      };
    },
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (webpackModuleCache[moduleId] = {
      exports: {},
    });
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  var webpackExports = webpackRequire("./src/index.js");
  calculator = webpackExports;
})();
