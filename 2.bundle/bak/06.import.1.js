// 定义一个模块定义的对象
var modules = {}

// 存放已经加载的模块的缓存
var cache = {}
// 在浏览器里实现require方法，和nodejs中的commonjs规范一致
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (cache[moduleId] = {
    exports: {}
  })
  // 模块modules的key是模块id，value是方法，方法体是模块内容
  // 调用模块的方法
  modules[moduleId](module, module.exports, require)
  return module.exports
}

require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
  }
}

require.r = exports => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
  Object.defineProperty(exports, '__esModule', { value: true })
}

//已经安装过的，或者说已经加载好的代码块
//key是代码块的名字，值是代码块的状态
//main就是默认代码块的名称 0表示已经加载完成
var installedChunks = {
  main: 0
  //当一个代码块它的值是一个数组的时候表示此代码块对应的JS文件正在加载中
  //'hello': [resolve, reject,promise]
}

/**
 *
 * @param {*} chunkIds 代码块ID数组
 * @param {*} moreModules 额外的模块定义
 * 加载完hello.main.js文件后，会调用chunkLoadingGlobal.push，chunkLoadingGlobal.push就是webpackJsonpCallback
 *
 */
function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = []
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i]
    resolves.push(installedChunks[chunkId][0])
    installedChunks[chunkId] = 0 //表示此代码块已经下载完毕
  }
  // 合并模块定义到modules去
  // 把hello.main.js模块合并到modules去
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId]
  }
  // 依次取出promise的resolve方法，让它对应的promise变成成功态
  while (resolves.length) {
    resolves.shift()()
  }
}

// 给require方法定义一个m属性，指向模块定义对象
require.m = modules
require.f = {}
// 返回此文件对应的访问路径
require.p = '' // publicPath文件访问路径
// 返回此代码块对应的文件名
require.u = function (chunkId) {
  return chunkId + '.main.js'
}

// l(link方法)，动态加载要异步执行的文件，js会阻塞后面的js执行
require.l = function (url) {
  let script = document.createElement('script')
  script.src = url
  document.head.appendChild(script)
}

/**
 *
 * jsonp 通过JSONP的方式加载chunkId对应的JS文件(其实就是06.hello.main.js)，
 * 生成一个promise放到promises数组里
 *
 * @param {*} chunkId 代码块ID
 * @param {*} promises promise数组
 */
require.f.j = function (chunkId, promises) {
  // 当前的代码块的数据，代码块的数据是一个数组
  let installedChunkData
  // 创建一个promise
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject]
  })
  // 代码块的数据是一个数组[resolve, reject, promise]
  installedChunkData[2] = promise
  // promise放到promises数组中
  promises.push(promise)
  // promises.push(installedChunkData[2] = promise);
  const url = require.p + require.u(chunkId)
  require.l(url)
}

// e(ensure方法)
require.e = function (chunkId) {
  let promises = []
  require.f.j(chunkId, promises)
  return Promise.all(promises)
}

// webpackChunk_2_bundle就是06.hello.main.js的chunkLoadingGlobal
var chunkLoadingGlobal = (window['webpackChunk_2_bundle'] = window['webpackChunk_2_bundle'] || [])
chunkLoadingGlobal.push = webpackJsonpCallback

/**
 * require.e异步加载hello代码块文件 hello.main.js
 * promise成功后会把 hello.main.js里面的代码定义合并到require.m对象上，也就是modules上
 * 调用require方法加载./src/hello.js模块，获取模块的导出对象，进行打印
 */
require
  .e('06.hello')
  .then(require.bind(require, './src/hello.js'))
  .then(result => {
    console.log(result)
  })

// chunk是什么？chunk是代码块，代码块其实就模块的集合
