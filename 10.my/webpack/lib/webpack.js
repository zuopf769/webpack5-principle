const Compiler = require("./Compiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");

const webpack = (options, callback) => {
  let compiler = new Compiler(options.context); // 创建一个Compiler实例
  compiler.options = options; // 给它赋于一个options属性
  new NodeEnvironmentPlugin().apply(compiler); // 让compiler可以读文件和写文件
  //挂载配置文件里提供的所有的plugins
  if (options.plugins && Array.isArray(options.plugins)) {
    // new配置文件里配置的插件并依次调用apply方法
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }
  return compiler;
};

exports = module.exports = webpack;
