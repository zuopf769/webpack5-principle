const path = require('path')
const fs = require('fs')

// mac  window系统都不会报错
// path.posix兼容mac  window系统
let c1 = fs.readFileSync(path.posix.join(__dirname, '1.txt'))

// mac 会报错，windows不会报错
let c2 = fs.readFileSync(path.win32.join(__dirname, '1.txt'))

// console.log(c1 === c2)
