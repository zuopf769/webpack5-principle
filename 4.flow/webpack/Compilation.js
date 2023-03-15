// https://webpack.docschina.org/api/compilation-hooks/
// Compilation 模块会被 Compiler 用来创建新的 compilation 对象（或新的 build 对象）。
// compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。
// 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。
// 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。
class Compilation {
  build(callback) {}
}
