/**
 * 在编译完成后，希望把dist目录下所有的文件打在一个压缩包，保存到输出目录里
 */
const jszip = require("jszip");

class ArchivePlugin1 {
  // compiler对象
  apply(compiler) {
    // 通过compiler.hooks.compilation钩子拿到compilation对象
    // https://webpack.js.org/api/compiler-hooks/#compilation
    compiler.hooks.compilation.tap("ArchivePlugin", (compilation) => {
      // 通过compilation.hooks.processAssets钩子拿到assets
      // webpack.js.org/api/compilation-hooks/#processassets
      // 静态资源都拿到开始解析静态资源
      https: compilation.hooks.processAssets.tapPromise(
        { name: "ArchivePlugin" },
        (assets) => {
          const zip = new jszip();
          for (const pathname in assets) {
            // assets: { [pathname: string]: Source } 资源 key是pathname，value是源代码Source
            // 得到源代码
            const source = assets[pathname];
            const sourceCode = source.source(); //返回源代码字符串
            zip.file(pathname, sourceCode); // 添加文件到压缩包
          }
          return zip.generateAsync({ type: "nodebuffer" }).then((content) => {
            assets[`${Date.now()}.zip`] = {
              source() {
                return content;
              },
            };
          });
        }
      );
    });
  }
}

module.exports = ArchivePlugin1;
