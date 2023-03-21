(() => {
  var __webpack_modules__ = {
    "./loaders/less-loader1.js!./src/index.less": (module) => {
      module.exports = "#root {\n  color: red;\n}\n";
    },
    "./src/index.less": (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      let styleCSS = __webpack_require__(
        "./loaders/less-loader1.js!./src/index.less"
      );
      let style = document.createElement("style");
      style.innerHTML = styleCSS;
      document.head.appendChild(style);
    },
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = {};
  (() => {
    "use strict";
    __webpack_require__("./src/index.less");
  })();
})();
