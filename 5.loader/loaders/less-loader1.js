const less = require("less");

/**
 *
 * @param {*} source less源代码
 */
function loader(source) {
  // 将同步loader转换成异步执行
  let callback = this.async();
  // 把less转换成css
  less.render(source, { filename: this.resource }, (err, output) => {
    // console.log(output);
    // { css: '#root {\n  color: red;\n}\n', imports: [] }
    // less-loader把css转换成js模块
    // 为啥要JSON.stringify？为了变成字符串，而不是变量
    // ps 当然这里也可以直接返回css字符串，但是真正的less-loader是返回的模块
    callback(err, `module.exports = ${JSON.stringify(output.css)}`);
  });
}

module.exports = loader;
