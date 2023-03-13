var modules = {
  './src/title.js': module => {
    module.exports = {
      name: 'title_name',
      age: 'title_age'
    }
  }
}

var cache = {}
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (cache[moduleId] = {
    exports: {}
  })
  modules[moduleId](module, module.exports, require)
  return module.exports
}

require.n = module => {
  //因为如果原来是es module的话，它的默认导出会放在exports.default上
  //如果原来是commonjs的话，默认导出就是exports
  var getter = module && module.__esModule ? () => module['default'] : () => module
  //require.d(getter, { a: getter });
  //给getter添加一个a属性，a的值就是getter的返回值 getter.a
  require.d(getter, {
    a: getter
  })
  return getter
}

require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      })
    }
  }
}

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

require.r = exports => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    })
  }
  Object.defineProperty(exports, '__esModule', {
    value: true
  })
}

var exports = {}
//index.js
//只要打包前的模块是一个es module,那么就会调用require.r方法进行处理
require.r(exports) //表明这个exports是原来是es module
debugger
var _title_0__ = require('./src/title.js')
var _title_0___default = require.n(_title_0__)
console.log(_title_0___default())
console.log(_title_0__.age)
