;(() => {
  var __webpack_modules__ = {
    './src/xx.baxx': module => {
      module.exports = 'baxx-loader1-loader2'
    },
    './src/message.js': module => {
      module.exports = 'msg'
    },
    './src/title.js': (module, __unused_webpack_exports, __webpack_require__) => {
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
