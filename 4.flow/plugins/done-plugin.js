class DonePlugin {
  apply(compiler) {
    // webpack插件，靠的是调用webpack内置的的钩子
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('done:结束编译')
    })
  }
}
module.exports = DonePlugin

// hooks上有其他的各种各样的钩子，就是 tapable的SyncHook实例，所以可以tap绑定钩子执行函数
/* let compiler = {
    hooks: {
      run:new Hook(),
      done:new Hook()
    }
  } */

// compiler.hooks.done 不是固定的
// hoos的key都有什么呀
// https://webpack.js.org/api/compiler-hooks/#done
// 跟订阅先后没关系，先走run再走done

// babel和webpack的关系是什么？ 执行顺序是啥？
// webpack在编译的时候，如果遇到js文件，会调用babel-loader进行文件内容的转换
// 在babel转换的时候会使用babel插件来转换
