let SingleEntryPlugin = require("./SingleEntryPlugin");

const itemToPlugin = (context, item, name) => {
  //单入口插件
  return new SingleEntryPlugin(context, item, name);
};

class EntryOptionPlugin {
  apply(compiler) {
    //context 项目根目录 entry入口文件相对路径
    compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
      if (typeof entry === "string") {
        itemToPlugin(context, entry, "main").apply(compiler);
      } else {
        // 把入口的每一项转换成插件
        for (let entryName in entry) {
          itemToPlugin(context, entry[entryName], entryName).apply(compiler);
        }
      }
    });
  }
}
module.exports = EntryOptionPlugin;
