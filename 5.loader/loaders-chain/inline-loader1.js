function loader(source) {
  console.log("inline-loader1");
  return source + "//inline-loader1";
}

loader.pitch = () => {
  console.log("inline-loader1-pitch");
};

module.exports = loader;
