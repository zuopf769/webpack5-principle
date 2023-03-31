(() => {
  "use strict";
  var webpackModules = {
    jquery: (module) => {
      // 读取全局变量，从全局变量读取$再导出
      module.exports = $;
    },
    lodash: (module) => {
      // 读取全局变量，从全局变量读取_再导出
      module.exports = _;
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
  (() => {
    webpackRequire.n = (module) => {
      var getter =
        module && module.esmodule ? () => module["default"] : () => module;
      webpackRequire.d(getter, {
        a: getter,
      });
      return getter;
    };
  })();
  (() => {
    webpackRequire.d = (exports, definition) => {
      for (var key in definition) {
        if (
          webpackRequire.o(definition, key) &&
          !webpackRequire.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();
  (() => {
    webpackRequire.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    webpackRequire.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
      }
      Object.defineProperty(exports, "esmodule", {
        value: true,
      });
    };
  })();
  var webpackExports = {};
  (() => {
    webpackRequire.r(webpackExports);
    var lodashwebpackImportedModule0 = webpackRequire("lodash");
    var lodashwebpackImportedModule0_Default = webpackRequire.n(
      lodashwebpackImportedModule0
    );
    let $ = webpackRequire("jquery");
    console.log(lodashwebpackImportedModule0_Default(), $);
  })();
})();
