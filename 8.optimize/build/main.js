(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["calculator"] = factory();
  else root["calculator"] = factory();
})(self, () => {
  return (() => {
    var webpackModules = {
      "./src/index.js": (module) => {
        module.exports = {
          add(a, b) {
            return a + b;
          },
          multi(a, b) {
            return a * b;
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
    webpackExports = webpackExports.add;
    return webpackExports;
  })();
});
