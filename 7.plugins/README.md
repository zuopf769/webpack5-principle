## 1. plugin

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子

### 1.1 为什么需要一个插件

- webpack 基础配置无法满足需求
- 插件几乎能够任意更改 webpack 编译结果
- webpack 内部也是通过大量内部插件实现的

### 1.2 可以加载插件的常用对象

#### 1.2.1 Compiler 编译器对象

代表 webpack 的一次启动编译，watch 文件变化后的是 Compilation，都属于这一次启动编译

**对象**

[Compiler](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compiler.js)

**钩子**

- run 开始编译
- compile 编译
- compilation 开始创建一次新的编译
- make 构建入口
- emit 输出结果
- done 编译完成

#### 1.2.2 Compilation 编译对象

**对象**

[Compilation](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js)

文件发生变化就会创建一次新的编译

**钩子**

- buildModule 构建模块，编译模块
- normalModuleLoader 加载普通模块
- succeedModule 成功编译完成一个模块
- finishModules 把所有的模块都编译完成了
- seal 封装代码块
- optimize 优化代码块
- after-seal 封装代码块完成

#### 1.2.3 Module Factory 模块工厂对象

根据 config 配置文件中的 module 配置的 loader，加载 loader、创建模块对象，解析文件源码

**对象**

[Module Factory](https://github.com/webpack/webpack/blob/main/lib/ModuleFactory.js)

**钩子**

什么叫解析：

- beforeResolver 解析之前
- afterResolver 解析之后：拿到这个模块的所有 loader 的绝对路径和资源本身
- module 创建模块
- parser 解析源码创建语法树

#### 1.2.4 Module

模块本身

#### 1.2.5 Parser 解析语法树

ast 解析 traverse

**对象**

[Parser](https://github.com/webpack/webpack/blob/main/lib/Parser.js)

**钩子**

- program 遇到 program 程序入口 node 节点
- statement 遇到 statement 声明语句 node 节点
- call 遇到 call 调用 node 节点
- expression 遇到 expression 表达式 node 节点

#### 1.2.6 Template

根据模板生成源代码

**对象**

[Template](https://github.com/webpack/webpack/blob/main/lib/Template.js)

**钩子**

- hash hash 码
- bootstrap 入口文件启动文件
- localVars 局部变量
- render 渲染生成代码

## 2. 创建插件

- 插件是一个类
- 类上有一个 apply 的实例方法
- apply 的参数是 compiler

```js
class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {}
}
module.exports = DonePlugin;
```

## 3. Compiler 和 Compilation

在插件开发中最重要的两个资源就是`compiler`和`compilation`对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

- compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

- compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

## 4. 基本插件架构

- 插件是由「具有 apply 方法的 prototype 对象」所实例化出来的
- 这个 apply 方法在安装插件时，会被 webpack compiler 调用一次
- apply 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象

### 4.1 使用插件代码

[使用插件]https://github.com/webpack/webpack/blob/master/lib/webpack.js#L60-L69)

```js
if (options.plugins && Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
    plugin.apply(compiler);
  }
}
```

### 4.2 Compiler 插件

[done: new AsyncSeriesHook(["stats"])](https://github.com/webpack/webpack/blob/main/lib/Compiler.js#L132)

#### 4.2.1 同步

```js
class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tap("DonePlugin", (stats) => {
      console.log("Hello ", this.options.name);
    });
  }
}
module.exports = DonePlugin;
```

#### 4.2.2 异步

```js
class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync("DonePlugin", (stats, callback) => {
      console.log("Hello ", this.options.name);
      callback();
    });
  }
}
module.exports = DonePlugin;
```

### 4.3 使用插件

要安装这个插件，只需要在你的 webpack 配置的 plugin 数组中添加一个实例

```js
const DonePlugin = require("./plugins/DonePlugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve("build"),
    filename: "bundle.js",
  },
  plugins: [new DonePlugin({ name: "zuopf" })],
};
```

## 5. compilation 插件

使用 compiler 对象时，你可以绑定提供了编译 compilation 引用的回调函数，然后拿到每次新的 compilation 对象。这些 compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中

#### 5.1 webpack-assets-plugin.js

plugins\webpack-assets-plugin.js

```js
//编写个Compilation插件，用来打印本次产出的代码块和文件
class WebpackAssetsPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    //每当webpack开启一次新的编译 ，就会创建一个新的compilation
    compiler.hooks.compilation.tap("WebpackAssetsPlugin", (compilation) => {
      //每次根据chunk创建一个新的文件后会触发一次chunkAsset
      compilation.hooks.chunkAsset.tap(
        "WebpackAssetsPlugin",
        (chunk, filename) => {
          console.log(chunk.name || chunk.id, filename);
        }
      );
    });
  }
}
module.exports = WebpackAssetsPlugin;
```

## 6. 打包 zip

[webpack-sources](https://www.npmjs.com/package/webpack-sources)

### 6.1 webpack-archive-plugin.js

plugins\webpack-archive-plugin.js

```js
const jszip = require("jszip");
const { RawSource } = require("webpack-sources");
const { Compilation } = require("webpack");
/**
 * 1.如何获取打出后的文件名和文件内容
 * 2.如何打压缩包
 * 3.如何向目标目录输出压缩包
 */
class WebpackArchivePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("WebpackAssetsPlugin", (compilation) => {
      //当确定好文件，当你处理每个资源的时候处执行
      compilation.hooks.processAssets.tapPromise(
        { name: "WebpackArchivePlugin" },
        (assets) => {
          const zip = new jszip();
          for (const filename in assets) {
            const sourceObj = assets[filename];
            const sourceCode = sourceObj.source();
            zip.file(filename, sourceCode);
          }
          return zip
            .generateAsync({ type: "nodebuffer" })
            .then((zipContent) => {
              assets[`archive_${Date.now()}.zip`] = new RawSource(zipContent);
            });
        }
      );
    });
  }
}
module.exports = WebpackArchivePlugin;
```

### 6.2 webpack.config.js

webpack.config.js

```js
const WebpackArchivePlugin = require("./plugins/webpack-archive-plugin");
plugins: [
  new WebpackArchivePlugin({
    filename: "[timestamp].zip",
  }),
];
```
