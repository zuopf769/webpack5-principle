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

loader.pitch = (_, _, data) => {
  // 在pith中设置了data后，然后执行normal方法时，可以通过this取到
  data.age = 100;
  console.log("inline-loader1-pitch");
};

module.exports = loader;
