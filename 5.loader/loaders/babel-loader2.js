const babel = require("@babel/core");
const path = require("path");

// 这里的参数来自上一个loader传递过来的，可以传递多个参数过来
function loader(source, ast, inputSourceMap) {
  // 在loader里this其实是一个称为loaderContext的对象
  // 如果loader里面的处理过程是异步的，需要把loader的执行从同步变成异步
  // https://webpack.docschina.org/api/loaders/#thisresourcepath
  // 告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  // console.log(this);

  // 把loader的执行从同步变成异步
  const callback = this.async();
  let options = this.getOptions();
  // 复用上一个loader的ast和SourceMap
  let babelOptions = {
    ...options,
    ast: true, // 如果两个loader都涉及到了babel转换源码的功能，可以不用都从源码转换成ast，可以直接传过来ast，提高性能
    sourceMaps: true, //当前转换babel的时候要生成sourcemap
    inputSourceMap, //接收上一个份sourcemap
  };

  // 从源码异步转换
  // babel.transformAsync(source, babelOptions).then(({ code }) => {
  //   //在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
  //   callback(null, code);
  //   //this.callback(null,code);
  // });
  //

  // 从ast异步转换
  babel.transformFromAstAsync(ast, babelOptions).then(({ code }) => {
    //在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
    callback(null, code);
    //this.callback(null,code);
  });
}

module.exports = loader;

/* 同步转换
function loader(source) {
  //在loader里this其实是一个称为loaderContext的对象
  let options = this.getOptions();
  const { code} = babel.transformSync(source,options);
  return code;
} 
*/

/**
 * 异步
 * function loader(source) {
  //在loader里this其实是一个称为loaderContext的对象
  //需要把loader的执行从同步变成异步
  //https://webpack.docschina.org/api/loaders/#thisresourcepath
  //告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  //console.log(this);
  const callback = this.async();
  console.log(callback === this.callback);
  let options = this.getOptions();
  babel.transformAsync(source, options).then(({ code }) => {
    //在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
    callback(null, code);
    //this.callback(null,code);
  });
}
 */
