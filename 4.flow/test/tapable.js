// 类似于 Node.js 中的 EventEmitter 的库，但更专注于自定义事件的触发和处理
// webpack 通过 tapable 将实现与流程解耦，所有具体实现通过插件的形式存在
class SyncHook {
  taps = []
  tap(name, fn) {
    //类似node中EventEmitter的on方法
    this.taps.push(fn)
  }
  call() {
    //类似node中的EventEmitter的trigger
    this.taps.forEach(tap => tap())
  }
}

let runHook = new SyncHook()

// runHook.tap('a', () => {
//   console.log(1)
// })
// runHook.tap('b', () => {
//   console.log(2)
// })
// runHook.call()

// 插件
class RunPlugin {
  apply() {
    runHook.tap('1', () => {
      console.log('1')
    })
  }
}

let runPlugin = new RunPlugin()
runPlugin.apply()
runHook.call()
