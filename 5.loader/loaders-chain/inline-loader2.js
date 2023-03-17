function loader(source) {
  console.log("inline-loader2");
  return source + "//inline-loader2";
}

loader.pitch = () => {
  console.log("inline-loader2-pitch");
};

module.exports = loader;
