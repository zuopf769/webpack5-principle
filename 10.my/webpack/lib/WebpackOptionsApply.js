/**
 * 挂载各种各样的内置插件
 */
let EntryOptionPlugin = require("./EntryOptionPlugin");

class WebpackOptionsApply {
  process(options, compiler) {
    // 挂载入口文件插件
    new EntryOptionPlugin().apply(compiler);
    // 触发entryOption钩子 context也就是根目录的路径 entry表示入口 './src/index.js',
    compiler.hooks.entryOption.call(options.context, options.entry);
  }
}

module.exports = WebpackOptionsApply;
