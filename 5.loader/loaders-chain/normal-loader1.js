function loader(source) {
  //let callback = this.async();
  console.log("normal-loader1");
  /* setTimeout(() => {
    callback(null,1,2,3)
  },1000); */
  return source + "//normal-loader1";
}

loader.pitch = () => {
  console.log("normal-loader1-pitch");
};

module.exports = loader;
