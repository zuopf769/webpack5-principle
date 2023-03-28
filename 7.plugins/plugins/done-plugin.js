class DonePlugin {
  apply(compiler) {
    // 同步钩子
    compiler.hooks.done.tap("DonePlugin", (stats) => {
      console.log("DonePlugin.tap");
    });
    // 异步钩子
    compiler.hooks.done.tapAsync("DonePlugin", (stats, callback) => {
      console.log("DonePlugin.tapAsync");
      // 异常为null
      callback(null);
    });
  }
}
module.exports = DonePlugin;
