class HashPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("HashPlugin", (compilation) => {
      // 如果你想改变hash值，可以在hash生成之后修改
      // https://webpack.docschina.org/api/compilation-hooks/#afterhash
      compilation.hooks.afterHash.tap("HashPlugin", () => {
        // 已经生成好的hash
        console.log("hash", compilation.hash);
        // 强制修改hash，只是用来test
        compilation.hash = "hash";
        // 修改chunkHash
        // compilation.chunks代表每个代码块
        for (let chunk of compilation.chunks) {
          console.log("renderedHash", chunk.renderedHash); //chunkHash
          // 强制修改renderedHash
          chunk.renderedHash = "chunkhash";
          console.log("contentHash", chunk.contentHash); // contentHash
          // contentHash是个对象
          chunk.contentHash = {
            "css/mini-extract": "csshash", // css的hash
            javascript: "jshash", // js的hash
          };
        }
      });
    });
  }
}
module.exports = HashPlugin;
