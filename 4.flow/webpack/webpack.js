const Compiler = require('./Compiler')

function webpack(options) {
  // 1.初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
  // argv[0]是Node程序的绝对路径 argv[1] 正在运行的脚本；所以0和1不要，真正的参数从第二个开始
  // console.log(argv)
  const argv = process.argv.slice(2)
  // 命令行执行webpack命令时的后面的参数，例如webpack --mode=development
  const shellOptions = argv.reduce((shellOptions, options) => {
    // options = '--mode=development'
    // node debugger.js --mode=development --debuger=true
    // 如何调试：JavaScript Debug Terminal后，在打开的控制台输入上面的脚本就可以测试了
    const [key, value] = options.split('=')
    shellOptions[key.slice(2)] = value
    return shellOptions
  }, {})

  // 最终的配置对象
  // shellOptions的优先级高
  // shellOptions中的配置项会覆盖配置文件webpack.config.js中的配置
  const finalOptions = { ...options, ...shellOptions }

  // console.log(finalOptions)

  // 2.用上一步得到的参数初始化 `Compiler` 对象
  // 单例，编译过程中只有一份
  const compiler = new Compiler(finalOptions)

  // 3.加载所有配置的插件，
  // 插件是在编译之前就加载好
  // 虽然在编译开始之前就都注册了，但是会在编译过程也就是编译生命周期的某个时间点触发执行
  const { plugins } = finalOptions
  for (let plugin of plugins) {
    // 插件规范：是一个类，一定有个方法apply，apply一定有个参数compiler
    plugin.apply(compiler)
  }

  return compiler
}

module.exports = webpack
