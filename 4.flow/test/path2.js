// linux /Users/hualala/work/github/webpack5-principle/4.flow/test
// windows c:\hualala\work\github\webpack5-principle\4.flow\test
console.log(process.cwd())

//
const baseDir = normalizePath(process.cwd())
function normalizePath(path) {
  return path.replace(/\\/g, '/')
}

// 在window下的目录会转成linux下的路径风隔符
console.log(normalizePath(process.cwd()))
