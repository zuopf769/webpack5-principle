function loader(source) {
  console.log("post-loader1");
  return source + "//post-loader1";
}

loader.pitch = () => {
  console.log("post-loader1-pitch");
};

module.exports = loader;
