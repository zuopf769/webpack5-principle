// 如何自定义loader
// https://webpack.docschina.org/contribute/writing-a-loader/
// https://webpack.js.org/contribute/writing-a-loader/

// Loader Interface
// https://webpack.docschina.org/api/loaders/

// loader-utils
// https://github.com/webpack/loader-utils

// schema-utils
// https://github.com/webpack/schema-utils

const core = require("@babel/core");
const path = require("path");

// 通常只有一个loader执行babel
function loader(source) {
  // this是loaderContext 上下文对象, loader执行过程中是同一个对象
  // https://github.com/webpack/loader-runner/blob/main/lib/LoaderRunner.js#L290-L387
  // https://webpack.docschina.org/api/loaders/
  // this.request是/loaders/babel-loader.js!/src/index.js
  // this.resourcePath是/src/index.js
  let filename = this.resourcePath.split(path.sep).pop();
  let options = this.getOptions();
  let loaderOptions = {
    ...options,
    sourceMaps: true, //我会基于上一个份sourcemap生成自己的sourcemap
    filename,
  };
  //code转译后的代码 源代码和转译后的代码的映射文件 抽象语法树
  let { code, map, ast } = core.transformSync(source, loaderOptions);
  //如果想往 下一个loader传递多个值，可以使用this.callback,它是同步的
  // this.callback(null, code, map, ast);
  return code;
}

module.exports = loader;

/* 
同步转换
function loader(source) {
  //在loader里this其实是一个称为loaderContext的对象
  let options = this.getOptions();
  const { code} = babel.transformSync(source,options);
  return code;
} */
