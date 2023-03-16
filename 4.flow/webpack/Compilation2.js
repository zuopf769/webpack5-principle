const path = require('path')
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const types = require('@babel/types')

const baseDir = normalizePath(process.cwd())
function normalizePath(path) {
  return path.replace(/\\/g, '/')
}

// 该文件没有解决循环依赖

// https://webpack.docschina.org/api/compilation-hooks/
// Compilation 模块会被 Compiler 用来创建新的 compilation 对象（或新的 build 对象）。
// compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。
// 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。
// 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。
class Compilation {
  constructor(options, compiler) {
    this.options = options
    this.compiler = compiler
    this.modules = [] // 这里放置本次编译涉及的所有的模块
    this.chunks = [] // 本次编译所组装出的代码块
    this.assets = {} // key是文件名,值是文件内容
    this.files = [] // 代表本次打包出来的文件
    // 用Set可以避免重复，模块互相依赖的话只能放一份到set中
    this.fileDependencies = new Set() // 本次编译依赖的所有文件或者说模块，包括入口文件和入口文件依赖的文件，用于watch某个文件发生变化后，重新Compilation
  }
  // 这个才是编译最核心的方法
  build(callback) {
    // 5.根据配置中的entry找出入口文件
    let entry = {}
    // entry是个语法糖，webpack.config配置文件中可能是字符串，也可能是对象
    // 不管是字符串还是对象都统一处理成对象
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry
    } else {
      entry = this.options.entry
    }

    // entry多入口or单入口都是一个对象
    for (let entryName in entry) {
      // entry的完整路径 - 绝对路径
      let entryFilePath = path.posix.join(baseDir, entry[entryName])
      this.fileDependencies.add(entryFilePath)
      // console.log(this.fileDependencies)
      // 6.从入口文件出发,调用所有配置的Loader对模块进行编译
      let entryModule = this.buildModule(entryName, entryFilePath)
      // 要放在chunk的下面，要不然filter会把entryModule也过滤出来
      // this.modules.push(entryModule)
      // 8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
      let chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter(module => module.names.includes(entryName))
      }
      // 放在这里就是为了避免把entryModule也放到了chunk.modules中
      // 但是我不知道webpack源码是怎么区分entryModule和普通modules的
      this.modules.push(entryModule)
      this.chunks.push(chunk)
    }

    // 9.再把每个 Chunk 转换成一个单独的文件加入到输出列表
    this.chunks.forEach(chunk => {
      //  filename: '[name].js' 占位符name的替换
      const filename = this.options.output.filename.replace('[name]', chunk.name)
      this.files.push(filename)
      this.assets[filename] = getSource(chunk)
    })

    // console.dir(this.modules, null, 2)
    console.dir(this.chunks, null, 2)

    // webpack函数的回调
    callback(
      null, // error
      {
        modules: this.modules,
        chunks: this.chunks,
        assets: this.assets,
        files: this.files
      }, // stats
      this.fileDependencies // fileDependencies
    )
  }

  /**
   * 编译模块
   * @param {*} name 模块所属的代码块(chunk)的名称，也就是entry的name entry1 entry2
   * @param {*} modulePath 模块的路径
   */
  buildModule(name, modulePath) {
    // 1.读取文件的内容
    let sourceCode = fs.readFileSync(modulePath, 'utf8')
    let { rules } = this.options.module
    // 2. 根据规则找到所有匹配的loader，用loader对模块进行转换
    // loaders=[logger1,logger2]
    let loaders = []
    rules.forEach(rule => {
      // 同一个rule，可以配置多份loader，如 test: /\.jsx?$/,可以配置多次
      if (modulePath.match(rule.test)) {
        loaders.push(...rule.use)
      }
    })
    // 调用所有配置的Loader对模块进行转换， 从右向左执行
    sourceCode = loaders.reduceRight((sourceCode, loader) => {
      // 加载loader，loader是个函数，把源码传给loader，转换后返回
      // sourceCode一直往下传，经过所有loader处理后最终完成转换，变成js代码
      return require(loader)(sourceCode)
    }, sourceCode)

    // 7.再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    // 声明当前模块的ID，模块ID是相对路径'./src/message.js'
    // 测试示例 doc/1.js，在从两个绝对路径解析出相对路径
    let moduleId = './' + path.posix.relative(baseDir, modulePath) // './' + 'src/message.js'
    // 创建一个模块ID，就是相对于根目录的相对路径 dependencies就是此模块依赖的模块
    // name是模块所属的代码块的名称,如果一个模块属于多个代码块，那么name就是一个数组
    let module = { id: moduleId, dependencies: [], names: [name] }
    // 必须这里就push返回就解决
    // 解析源码生成ast抽象语法树，分析模块依赖
    let ast = parser.parse(sourceCode, { sourceType: 'module' })
    // visitor是babel对ast的遍历器或者访问器
    // ast可视化 https://astexplorer.net/
    traverse(ast, {
      CallExpression: ({ node }) => {
        // node从path路径解构出来
        if (node.callee.name === 'require') {
          // require方法里面的参数arguments
          // 获取依赖模块的相对路径 wepback打包后不管什么模块，模块ID都是相对于根目录的相对路径 ./src ./node_modules
          let depModuleName = node.arguments[0].value //"./title"
          let depModulePath
          if (depModuleName.startsWith('.')) {
            // 获取当前模块的所在的目录，因为相对路径就是当前文件所在的目录
            const currentDir = path.posix.dirname(modulePath) // /Users/xxx/xxx/webpack5-principle/4.flow/src
            // 要找当前模块所在目录下面的绝对路径
            // /Users/xxx/xxx/webpack5-principle/4.flow/src 和 ./title.js路径拼接成绝对路径
            depModulePath = path.posix.join(currentDir, depModuleName)
            // 此绝对路径可能没有后缀，需要尝试添加后缀
            const extensions = this.options.resolve.extensions
            depModulePath = tryExtensions(depModulePath, extensions)
          } else {
            //如果不是以.开头的话，就是第三方模块，也能返回决定路径
            depModulePath = require.resolve(depModuleName)
          }
          this.fileDependencies.add(depModulePath)
          // 获取依赖的模块的ID
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath)
          // 修改语法树，把依赖的模块名换成模块ID
          // 源码中的是./title，转换后是 ./src/title.js
          // 为啥要改，因为模块的ID加了./src，那么生成的源码中肯定也要改成一致的，要不然就找不到相应的模块了
          node.arguments[0] = types.stringLiteral(depModuleId) // ./title => ./src/title.js
          // 把依赖的块ID和依赖的模块路径放置到当前模块的依赖数组中
          module.dependencies.push({
            depModuleId,
            depModulePath
          })
        }
      }
    })

    let { code } = generator(ast) //根据改造后的语法树生成源代码
    module._source = code //module._source属必指向此模块的改造后的源码
    // 7.再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      // 判断此依赖的模块是否已经打包过了或者说编译过了就走缓存
      // 场景：一个模块被多个模块依赖，已经解析过一次了，就没必要再编译一次
      let existModule = this.modules.find(module => module.id === depModuleId)
      if (existModule) {
        existModule.names.push(name)
      } else {
        let depModule = this.buildModule(name, depModulePath)
        this.modules.push(depModule)
      }
    })

    return module
  }
}

// 模块绝对路径拼接后缀
function tryExtensions(modulePath, extensions) {
  // 如果文件存在表明路径是正确的
  if (fs.existsSync(modulePath)) {
    return modulePath
  }
  //  require文件时可以不写后缀；对模块后缀的解析，从左向右查找；找到合适的后缀就退出
  //  extensions: ['.js', '.jsx', '.ts', '.tsx']
  for (let i = 0; i < extensions.length; i++) {
    let filePath = modulePath + extensions[i]
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }
  throw new Error(`找不到${modulePath}`)
}

// 模块底部是入口模块的源代码，顶部是入口模块依赖的modules，key是module ID内容是一个方法，方法体是模块源代码
function getSource(chunk) {
  return `
  (() => {
    var modules = {
      ${chunk.modules
        .map(
          module => `
          "${module.id}": module => {
            ${module._source}
          }
        `
        )
        .join(',')}
    };
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = cache[moduleId] = {
        exports: {}
      };
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    var exports = {};
    (() => {
      ${chunk.entryModule._source}
    })();
  })();
  `
}

module.exports = Compilation
