/**
 * loader的本质就是一个函数，一个用于转换或者说翻译的函数
 * 把那些webpack不认识的模块 less sass baxx转换为webpack能认识的模块js json
 * 因为webpack只认识js和json，所以说其他文件类型的都转换成了js模块
 *
 */
function loader2(input) {
  // return input + '-loader2'
  // 最左侧的loader要返回webpack能识别的js语法
  return `module.exports = "${input}-loader2"`
}
module.exports = loader2
