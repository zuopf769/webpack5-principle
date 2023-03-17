function loader(source) {
  console.log("normal-loader1");
  return source + "//normal-loader1";
}

loader.pitch = () => {
  console.log("normal-loader1-pitch");
};

module.exports = loader;
