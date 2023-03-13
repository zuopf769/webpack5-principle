;(() => {
  var __webpack_modules__ = {
    './src/title.js': module => {
      function add(a, b) {
        return a + b
      }
      function multi(c, d) {
        return c * d
      }
      module.exports.name = 'title_name'
      module.exports.age = 'title_age'
      module.exports.add = add
      module.exports.multi = multi
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
    let title = __webpack_require__('./src/title.js')
    console.log(title)
  })()
})()
