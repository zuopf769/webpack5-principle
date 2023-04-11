## 1. 代码分割

- 对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack 有一个功能就是将你的代码库分割成 chunks 语块，当代码运行到需要它们的时候再进行加载

## 2. 入口点分割

- Entry Points：入口文件设置的时候可以配置
- 这种方法的问题
  - 如果入口 chunks 之间包含重复的模块(lodash)，那些重复模块都会被引入到各个 bundle 中
  - 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

```js
{
  // MPA, 多页面应用
  entry: {
   page1: "./src/page1.js",
   page2: "./src/page2.js"
  }
}
```

## 3 动态导入和懒加载

- 用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时
- 一般采用以下原则：
  - 对网站功能进行划分，每一类一个 chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
  - 被分割出去的代码需要一个按需加载的时机

### 3.1 video.js

hello.js

```js
module.exports = "video";
```

index.js

```js
document.querySelector("#play").addEventListener("click", () => {
  import("./video").then((result) => {
    console.log(result.default);
  });
});
```

index.html

```html
<button id="play">播放</button>
```

### 3.2 prefetch(预先拉取)

prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源

```html
<link rel="prefetch" href="utils.js" as="script" />
```

```js
button.addEventListener("click", () => {
  import(
    `./utils.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "utils" */
  ).then((result) => {
    result.default.log("hello");
  });
});
```

### 3.3 preload(预先加载)

- preload 通常用于本页面要用到的关键资源，包括关键 js、字体、css 文件
- preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度
- 在资源上添加预先加载的注释，你指明该模块需要立即被使用
- 一个资源的加载的优先级被分为五个级别,分别是
  - Highest 最高
  - High 高
  - Medium 中等
  - Low 低
  - Lowest 最低
  - 异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 Low
  - [link-rel-prefetch-preload-in-webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
  - [Support for webpackPrefetch and webpackPreload](https://github.com/jantimon/html-webpack-plugin/issues/1317)
  - [preload-webpack-plugin](https://www.npmjs.com/package/@vue/preload-webpack-plugin)
  - [webpackpreload-webpack-plugin](https://www.npmjs.com/package/webpackpreload-webpack-plugin)
  - [ImportPlugin.js](https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/dependencies/ImportParserPlugin.js#L108-L121)

```shell
$ npm install --save-dev webpackpreload-webpack-plugin
```

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/04/10/23-56-48-a8044d03b54ecc3e584c95a1581f5eae-20230410235648-3cca7d.png)

```html
<link rel="preload" as="script" href="utils.js" />
```

```js
import(
  `./video.js`
  /* webpackPreload: true */
  /* webpackChunkName: "video" */
);
```

webpackpreload-webpack-plugin

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
class WebpackpreloadWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("PreloadWebpackPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
        "PreloadWebpackPlugin",
        (htmlData) => {
          const { publicPath, assetTags } = htmlData;
          const { entrypoints, moduleGraph, chunkGraph } = compilation;
          for (const entrypoint of entrypoints) {
            const preloaded = entrypoint[1].getChildrenByOrders(
              moduleGraph,
              chunkGraph
            ).preload; // is ChunkGroup[] | undefined
            if (!preloaded) return;
            const chunks = new Set();
            for (const group of preloaded) {
              for (const chunk of group.chunks) chunks.add(chunk);
            }
            const files = new Set();
            for (const chunk of chunks) {
              for (const file of chunk.files) files.add(file);
            }
            const links = [];
            for (const file of files) {
              links.push({
                tagName: "link",
                attributes: {
                  rel: "preload",
                  href: `${publicPath}${file}`,
                },
              });
            }
            assetTags.styles.unshift(...links);
          }
        }
      );
    });
  }
}
module.exports = WebpackpreloadWebpackPlugin;
```

plugins\ImportPlugin.js

```js
class ImportPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "ImportPlugin",
      (compilation, { normalModuleFactory }) => {
        normalModuleFactory.hooks.parser
          .for("javascript/auto")
          .tap("ImportPlugin", (parser) => {
            parser.hooks.importCall.tap("ImportParserPlugin", (expr) => {
              const { options } = parser.parseCommentOptions(expr.range);
              console.log(options);
            });
          });
      }
    );
  }
}
module.exports = ImportPlugin;
```

### 3.4 preload vs prefetch

- preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源
- 而 prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源
- 所以建议：对于当前页面很有必要的资源使用 preload,对于可能在将来的页面中使用的资源使用 prefetch

## 4. 提取公共代码

- [split-chunks-plugin](https://webpack.js.org/plugins/split-chunks-plugin/)
- [common-chunk-and-vendor-chunk](https://github.com/webpack/webpack/tree/main/examples/common-chunk-and-vendor-chunk)

怎么配置单页应用?怎么配置多页应用?

### 4.1 为什么需要提取公共代码

- 大网站有多个页面，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题
- 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
- 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

### 4.2 如何提取

- 基础类库，方便长期缓存
- 页面之间的公用代码
- 各个页面单独生成文件

### 4.3 module chunk bundle

- module：就是 js 的模块化 webpack 支持 commonJS、ES6 等模块化规范，简单来说就是你通过 import 语句引入的代码
- chunk: chunk 是 webpack 根据功能拆分出来的，包含三种情况
  - 你的项目入口（entry）
  - 通过 import()动态引入的代码
  - 通过 splitChunks 拆分出来的代码
- bundle：bundle 是 webpack 打包之后的各个文件，一般就是和 chunk 是一对一的关系，bundle 就是对 chunk 进行编译压缩打包等处理之后的产出
