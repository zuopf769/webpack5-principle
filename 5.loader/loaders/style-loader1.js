function loader(source) {
  // source是js模块代码的字符串 "module.exports = \"#root {\\n  color: red;\\n}\\n\"";
  // sources是js模块
  // 1. 提取模块内容部分(ps,提取也有问题，不知道模块规范是什么)
  // 2. 替换\n为''
  // 3. JSON.stringify把变量转换成字符串
  let styleCSS = source.match(/module\.exports = "(.+)"/)[1];
  let script = `
        let style = document.createElement("style");
        style.innerHTML = ${JSON.stringify(styleCSS.replace(/\\n/g, ""))};
        document.head.appendChild(style);
      `;
  return script;
}
module.exports = loader;

// 该方案存在的问题
// 1. 不知道模块规范是什么，不一定是module.exports导出也可能是exports.xxx导出，不一定是commonjs规范，也是export default；目前的兼容性做的也不好
// 解决方案
// 1. 最好是能利用require方法加载模块，返回模块的字符串内容就可以了，而不用使用正则来match提取模块的字符串内容
