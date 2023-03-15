// common.js 加载 ES6 modules

// webpack的模块是一个对象modules，维护着该bundle相关的几个模块
// 想调试代码只需要在bak目录中运行http-server命令启动一个静态资源server就可以调试代码了
debugger
var modules = {
  './src/title.js': (module, exports, require) => {
    // 给exports对象上注册两个key:Symbol.toStringTag和__esModule
    require.r(exports)
    // exports上暴露的key，添加getter
    // getter就是esModule的live binding功能，每次取模块的值，都调用getter保证基本数据类型也能取到模块的最新的值
    // 闭包模块内部的变量_DEFAULT_EXPORT__、age，可以获取到模块内部最新的变量
    require.d(exports, {
      age: () => age,
      default: () => _DEFAULT_EXPORT__
    })
    // 模块内部的变量_DEFAULT_EXPORT__、age
    // 导出的default的值重新赋值给了_DEFAULT_EXPORT__变量，所以default如果是基本数据类型不会live binding，因为重新赋值给了一个新的变量_DEFAULT_EXPORT__
    const _DEFAULT_EXPORT__ = 'title_name'
    const age = 'title_age'
  }
}

// 模块缓存，避免循环依赖和多次执行modules中模块对象的方法
var cache = {}
// webpack的require方法
// 和nodejs中方法实现原理一样，只是不用读取文件了，文件内容都已经读取过了
function require(moduleId) {
  var cachedModule = cache[moduleId]
  // 有缓存就从缓存中读取
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  // module是一个对象，有一个属性exports也是一个对象
  var module = (cache[moduleId] = {
    exports: {}
  })
  // require一个模块的时候就是去modules对象找到相应的模块方法并执行,去把模块导出内容设置到module.exports对象上
  modules[moduleId](module, module.exports, require)
  return module.exports
}

// d方法（definition）
require.d = (exports, definition) => {
  // 遍历definition的所有key
  for (var key in definition) {
    // exports原本没有，definition有的key就处理
    if (require.o(definition, key) && !require.o(exports, key)) {
      // 重新定义了每一个key的getter方法，从exports上取值的时候，会走新的getter方法
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      })
    }
  }
}

// o方法（hasOwnProperty）
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

// r方法，给exports对象上注册了两个key
require.r = exports => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    // 给exports定义Symbol.toStringTag字段，保证Object.prototype.toString.call(exports) === 'Module'
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    })
  }
  // 给exports定义__esModule字段，标识该模块是从esModule转换过来的，可以根据exports是有这个字段来进行特殊逻辑处理
  Object.defineProperty(exports, '__esModule', {
    value: true
  })
}

let title = require('./src/title.js')
console.log(title.default)
console.log(title.age)
