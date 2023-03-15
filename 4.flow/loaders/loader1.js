/**
 * loader的本质就是一个函数，一个用于转换或者说翻译的函数
 * 把那些webpack不认识的模块 less sass baxx转换为webpack能认识的模块js json
 * 因为webpack只认识js和json，所以说其他文件类型的都转换成了js模块
 *
 */
function loader1(input) {
  // 1. 这样返回后，webpack编译不会报错，但是在html中运行时会报错，会把 baxx-loader1-loader2当做一个变量，但是这个变量没定义
  // return input + '-loader1'
  return `${input}-loader1`
}
module.exports = loader1
