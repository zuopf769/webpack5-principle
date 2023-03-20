const babel = require("@babel/core");
const path = require("path");
// loader normal从右向左执行，先执行babel-loader3再执行babel-loader2
function loader(source) {
  // 在loader里this其实是一个称为loaderContext的对象
  // 如果loader里面的处理过程是异步的，需要把loader的执行从同步变成异步
  // https://webpack.docschina.org/api/loaders/#thisresourcepath
  // 告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  // console.log(this);
  // 把loader的执行从同步变成异步;
  const callback = this.async();
  console.log(callback === this.callback);
  let options = this.getOptions();
  let babelOptions = {
    ...options,
    ast: true,
    sourceMaps: true, //生成sourcemap
  };
  //在内部会把源代码转成抽象语法树，然后进行转换语法树，然后重新生成源代码
  //map就是sourcemap ，可以把转换前的代码行列和转换后的代码行列进行映射
  babel.transformAsync(source, babelOptions).then(({ code, ast, map }) => {
    //在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
    callback(null, code, ast, map);
    //可以向后一个loader传递多个参数
    //this.callback(null,code);
  });
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
