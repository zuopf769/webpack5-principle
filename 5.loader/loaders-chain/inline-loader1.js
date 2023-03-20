function loader(source) {
  console.log(this.age, this.author);
  //console.log(this.loaders[2].data);
  console.log(this.data); //this.data是一个getter,从loader数组中获取当前的索引对应的loader,data
  //如果你要取别的loader的data
  //console.log(this.data.age);
  console.log("inline-loader1");
  return source + "//inline-loader1";
}

loader.pitch = () => {
  //data.age = 100;
  console.log("inline-loader1-pitch");
};

module.exports = loader;
