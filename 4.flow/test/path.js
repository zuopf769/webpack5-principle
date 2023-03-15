let path = require('path')
// window mac linux系统里面他们的路径分隔符不一样
console.log(path.posix.sep) // /
console.log(path.win32.sep) // \

console.log(path.sep) // 根据操作系统不同返回不同的结果
// 在webpack里面为了方便，为了统一处理，一律都采用path.posix.sep
