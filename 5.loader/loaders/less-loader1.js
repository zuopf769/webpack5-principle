const less = require("less");

function loader(source) {
  let callback = this.async();
  less.render(source, { filename: this.resource }, (err, output) => {
    // console.log(output);
    // { css: '#root {\n  color: red;\n}\n', imports: [] }
    // less-loader把css转换成js模块
    callback(err, `module.exports = ${JSON.stringify(output.css)}`);
  });
}

module.exports = loader;
