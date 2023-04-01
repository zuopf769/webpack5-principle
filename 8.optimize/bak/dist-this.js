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
  // this上新增属性，被赋值给通过 library 指定的名称
  this.calculator = webpackExports;
})();
