//var _title_0__ = require("./src/title.js");
var title = {
  name: 'title_name',
  age: 'title_age'
}
//因为如果原来是es module的话，它的默认导出会放在exports.default上
//如果原来是commonjs的话，默认导出就是exports
//返回一个获取默认导出的函数
function n(exports) {
  return exports.__esModule ? () => exports.default : () => exports
}
var titleDefault = n(title)
console.log(titleDefault())
