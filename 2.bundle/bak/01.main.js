// webpack的模块是一个对象modules，维护着该bundle相关的几个模块
var modules = {
  // 属性是一个模块的ID，也就是以根目录为当前目录的相对路径
  // 值是一个方法，方法的形参为module、exports、require
  './src/title.js': (module, exports, require) => {
    // 把模块导出内容设置到module.exports对象上
    module.exports = 'title'
  }
}

// webpack的require方法
// 和nodejs中方法实现原理一样，只是不用读取文件了，文件内容都已经读取过了
function require(moduleId) {
  // module是一个对象，有一个属性exports也是一个对象
  var module = {
    exports: {}
  }
  // require一个模块的时候就是去modules对象找到相应的模块方法并执行,去把模块导出内容设置到module.exports对象上
  modules[moduleId](module, module.exports, require)
  // 返回module.exports
  return module.exports
}

// require加载一个模块
let title = require('./src/title.js')

console.log(title)
