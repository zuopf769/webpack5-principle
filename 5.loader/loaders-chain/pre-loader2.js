function loader(source) {
  console.log("pre-loader2");
  return source + "//pre-loader2";
}

loader.pitch = () => {
  console.log("pre-loader2-pitch");
};

module.exports = loader;
