function loader(source) {
  // source是js模块代码的字符串 "module.exports = \"#root {\\n  color: red;\\n}\\n\"";
  // sources是
  // 1. 提取模块内容部分
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
