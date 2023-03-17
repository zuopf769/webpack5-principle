function loader(source) {
  console.log("post-loader2");
  return source + "//post-loader2";
}

loader.pitch = () => {
  console.log("post-loader2-pitch");
  // 如果返回了字符串,  接下来只有 post-loader1 会被系统执行，且 post-loader1 收到的参数是 //post-loader2-pitch
  // 后面的loader就不会执行了
  return "//post-loader2-pitch";
};

module.exports = loader;
