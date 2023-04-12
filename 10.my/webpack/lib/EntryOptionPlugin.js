let SingleEntryPlugin = require("./SingleEntryPlugin");

const itemToPlugin = (context, item, name) => {
  //单入口插件
  return new SingleEntryPlugin(context, item, name);
};

class EntryOptionPlugin {
  apply(compiler) {
    //context 项目根目录 entry入口文件相对路径
    compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
      // 单入口：entry是字符串
      if (typeof entry === "string") {
        itemToPlugin(context, entry, "main").apply(compiler);
      } else {
        // 多入口：entry是对象
        // 把入口的每一项转换成插件
        for (let entryName in entry) {
          // 把多入口变成单入口
          itemToPlugin(context, entry[entryName], entryName).apply(compiler);
        }
      }
    });
  }
}
module.exports = EntryOptionPlugin;
