/**
 * 在编译完成后，希望把dist目录下所有的文件打在一个压缩包，保存到输出目录里
 */
const jszip = require("jszip");
const { RawSource } = require("webpack-sources");

/**
 * 1.如何获取打出后的文件名和文件内容
 * 2.如何打压缩包
 * 3.如何向目标目录输出压缩包
 */

class ArchivePlugin {
  constructor(options) {
    this.options = options;
  }
  // compiler对象
  apply(compiler) {
    // 通过compiler.hooks.compilation钩子拿到compilation对象
    // https://webpack.js.org/api/compiler-hooks/#compilation
    // 每当webpack开启一次新的编译 ，就会创建一个新的compilation
    compiler.hooks.compilation.tap("ArchivePlugin", (compilation) => {
      // 通过compilation.hooks.processAssets钩子拿到assets
      // https://webpack.js.org/api/compilation-hooks/#processassets
      // 静态资源都拿到开始解析静态资源
      compilation.hooks.processAssets.tapPromise(
        {
          name: "ArchivePlugin",
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          additionalAssets: true,
        },
        (assets) => {
          const zip = new jszip();
          for (const pathname in assets) {
            // assets: { [pathname: string]: Source } 资源 key是pathname，value是源代码Source
            // 得到源代码
            console.log("ArchivePlugin", pathname);
            const source = assets[pathname];
            const sourceCode = source.source(); //返回源代码字符串
            zip.file(pathname, sourceCode); // 添加文件
            console.log("ArchivePlugin sourceCode", sourceCode);
          }
          return zip.generateAsync({ type: "nodebuffer" }).then((content) => {
            assets[`${Date.now()}.zip`] = new RawSource(content);
            /*  assets[`${Date.now()}.zip`] = {
            source() {
              return content;
            }
          } */
          });
        }
      );
    });
  }
}

module.exports = ArchivePlugin;
