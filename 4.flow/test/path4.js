const path = require('path')
const fs = require('fs')
function normalizePath(path) {
  return path.replace(/\\/g, '/')
}

const baseDir = normalizePath(process.cwd())

// 当前文件所在的根目录
console.log('baseDir', baseDir)
// 当前文件所在的目录
console.log('__dirname', __dirname)

const filePath1 = normalizePath(path.join(baseDir, './test/txt/1.txt'))
console.log('filePath1', filePath1)

const filePath = normalizePath(path.join(__dirname, 'txt/1.txt'))

console.log('filePath', filePath)

// 从两个绝对路径解析出相对路径
console.log(path.relative(baseDir, filePath))
