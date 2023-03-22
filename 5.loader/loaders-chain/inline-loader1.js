function loader(source) {
  // 这里的this就是loaderContext
  // 具体可以去自己实现的loader-runner.js中去看
  console.log(this.age, this.author);
  // 其实在当前loader也能取到其他loader的data属性；可以去自己实现的loader-runner.js中去看
  // console.log(this.loaders[2].data);
  console.log(this.data); // this.data是一个getter,从loader数组中获取当前的索引对应的loader,data
  // 如果你要取别的loader的data
  // console.log(this.data.age);
  console.log("inline-loader1");
  return source + "//inline-loader1";
}

loader.pitch = () => {
  // 在pith中设置了data后，然后执行normal方法时，可以通过this取到
  // data.age = 100;
  console.log("inline-loader1-pitch");
};

module.exports = loader;

// inline-loader啥时候需要用？
// 一个场景是：当你修改不了或不方便修改webpack.config配置的时候
// 另外一个场景： 根本就没有webpack配置

// pitch的作用
// pitch的作用之一：做一些准备工作处理
// pitch的作用之二：返回结果不走后门的loader

// 为啥css-loader或者style-loader要用pitch？
// 如果不用pitch，normal方法中返回了less-loader处理过返回的js的模块，需要提取模块内容比较麻烦
// 用了pitch就可以先不走less-loader，然后用require(xxx!less-loaer)直接返回less-loader处理的模块内容
// require方法就是从modules对象上通过moduleid读取模块内容
