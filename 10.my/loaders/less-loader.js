let less = require("less");
module.exports = function (source) {
  // less.render是 同步方法
  less.render(source, (err, output) => {
    this.callback(err, output.css);
  });
};
/* console.log(module.exports(`
@color:red;
body{
    background-color: @color;
}
`)); */
