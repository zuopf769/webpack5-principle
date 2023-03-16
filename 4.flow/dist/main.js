;(() => {
  var __webpack_modules__ = {
    // 模块ID
    './src/xx.baxx': module => {
      module.exports = 'baxx-loader1-loader2'
    },
    './src/message.js': module => {
      module.exports = 'msg'
    },
    './src/title.js': (module, __unused_webpack_exports, __webpack_require__) => {
      // 所以这里面的模块路径也要修改为何模块ID一致
      let msg = __webpack_require__('./src/message.js')
      module.exports = 'title' + msg
    }
  }
  var __webpack_module_cache__ = {}
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId]
    if (cachedModule !== undefined) {
      return cachedModule.exports
    }
    // 最终__webpack_require__是从__webpack_modules__通过module ID去找模块
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {}
    })
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__)
    return module.exports
  }
  var __webpack_exports__ = {}
  ;(() => {
    const title = __webpack_require__('./src/title.js')
    const baxx = __webpack_require__('./src/xx.baxx')
    console.log(title)
    console.log(baxx)
  })()
})()
