# 优化

## 1. 缩小范围

### 1.1 extensions

- 指定 extension 之后可以不用在 require 或是 import 的时候加文件扩展名,会依次尝试添加扩展名进行匹配
- 和 nodejs 模块加载的规则一样

```JavaScript
resolve: {
    extensions: [".js",".jsx",".json",".css"]
},
```

### 1.2 alias

配置别名可以加快 webpack 查找模块的速度

- 每当引入 bootstrap 模块的时候，它会直接引入 bootstrap,而不需要从 node_modules 文件夹中按模块的查找规则查找
- 如果不配置别名的话，默认 require('bootstrap')加载的是 main 字段对应的 js 文件，也不是 css 文件

```JavaScript
const bootstrap = path.resolve(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css')
resolve: {
+    alias:{
+        bootstrap
+    }
},
```

### 1.3 modules

- 对于直接声明依赖名的模块（如 react ），webpack 会类似 Node.js 一样进行路径搜索，搜索 node_modules 目录
- 这个目录就是使用 resolve.modules 字段进行配置的 默认配置

```JavaScript
resolve: {
    modules: ['node_modules'],
}
```

如果可以确定项目内所有的第三方依赖模块都是在项目根目录下的 node_modules 中的话

```JavaScript
resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
}
```

如果当前项目下有自定义的模块

```JavaScript
resolve: {
   modules: ['mymodules', 'node_modules'],
}
```

### 1.4 mainFields

默认情况下 package.json 文件则按照文件中 main 字段的文件名来查找文件

例如 bootstrap 的 package.json 中的字段

```JSON
{
 "main": "dist/js/bootstrap.js",
  "module": "dist/js/bootstrap.esm.js",
  "sass": "scss/bootstrap.scss",
  "style": "dist/css/bootstrap.css",
}
```

```JavaScript
resolve: {
  // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
  mainFields: ['browser', 'module', 'main'],
}
```

```JavaScript
resolve: {
  // target 的值为其他时，mainFields 默认值为：
  mainFields: ["module", "main"],
}
```

### 1.5 mainFiles

当目录下没有 package.json 文件时，我们说会默认使用目录下的 index.js 这个文件，其实这个也是可以配置的

```JavaScript
resolve: {
  mainFiles: ['index'], // 你可以添加其他默认使用的文件名
},
```

### 1.6 resolveLoader

resolve.resolveLoader 用于配置解析 loader 时的 resolve 配置,默认的配置

```JavaScript
module.exports = {
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.json' ],
    mainFields: [ 'loader', 'main' ]
  }
};
```

## 2. noParse

- module.noParse 字段，可以用于配置哪些模块文件的内容不需要进行解析
- 不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度
- 例如我们知道 jquery 和 lodash 不会依赖其他的第三方库，所以可以配置成 noParse，告诉 webpack 不需要对他们两个的内容进行解析了

```JavaScript
module.exports = {
// ...
module: {
  noParse: /jquery|lodash/, // 正则表达式
  // 或者使用函数
  noParse(content) {
    return /jquery|lodash/.test(content)
  },
}
}
// ...
```

> 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制

## 3. IgnorePlugin

### 3.1 src/index.js

默认 moment 会把会有的语言包都打到产物里面

```JavaScript
import moment from  'moment';
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

```

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/31/19-22-25-7513c18ffd10e4a55fcb390d2e4abe44-20230331192224-eb4d46.png)

### 3.2 按需加载所需要的语言包

```JavaScript
import moment from  'moment';
import 'moment/locale/zh-cn'
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

```

webpack.config.js

```JavaScript
 new webpack.IgnorePlugin({
      contextRegExp: /moment$/,//目录的正则
      resourceRegExp: /^\.\/locale/   //请求的正则
    }),
```

- 第一个是匹配引入模块路径的正则表达式
- 第二个是匹配模块的对应上下文，即所在目录名

## 4.费时分析

可以查看 webpack 构建的工作流中哪个 loader 或者 plugin 的消耗时间最长

```JavaScript
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
});
```

## 5.webpack-bundle-analyzer

是一个 webpack 的插件，需要配合 webpack 和 webpack-cli 一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

```shell
npm i webpack-bundle-analyzer -D

```

```JavaScript
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

## 6. libraryTarget 和 library

[output.librarytarget](https://webpack.js.org/configuration/output/#outputlibrarytarget)

- 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到它们
- webpack 不仅仅可以打包 web 项目应用，也可以打包库 library，供别的模块或者项目应用来使用

* output.library 配置导出库的名称
* output.libraryExport 配置要导出的模块中哪些子模块需要被导出。 它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
* output.libraryTarget 配置以何种方式导出库,是字符串的枚举类型，支持以下配置

| libraryTarget | 使用者的引入方式                      | 使用者提供给被使用者的模块的方式         |
| ------------- | ------------------------------------- | ---------------------------------------- |
| var           | 只能以 script 标签的形式引入我们的库  | 只能以全局变量的形式提供这些被依赖的模块 |
| commonjs      | 只能按照 commonjs 的规范引入我们的库  | 被依赖模块需要按照 commonjs 规范引入     |
| commonjs2     | 只能按照 commonjs2 的规范引入我们的库 | 被依赖模块需要按照 commonjs2 规范引入    |
| amd           | 只能按 amd 规范引入                   | 被依赖的模块需要按照 amd 规范引入        |
| this          |                                       |                                          |
| window        |                                       |                                          |
| global        |                                       |                                          |
| umd           | 可以用 script、commonjs、amd 引入     | 按对应的方式引入                         |

### 6.1 var (默认)

编写的库将通过 var 被赋值给通过 library 指定名称的变量。

#### 6.1.1 webpack.config.js

```JavaScript
{
  output: {
        path: path.resolve("build"),
        filename: "[name].js",
+       library:'calculator',
+       libraryTarget:'var'
  }
}
```

#### 6.1.2 index.js

```JavaScript
module.exports =  {
    add(a,b) {
        return a+b;
    }
}
```

#### 6.1.3 bundle.js

```JavaScript
var calculator=(function (modules) {}({})
```

#### 6.1.4 index.html

```html
<script src="bundle.js"></script>
<script>
  let ret = calculator.add(1, 2);
  console.log(ret);
</script>
```

### 6.2 commonjs

编写的库将通过 CommonJS 规范导出。

#### 6.2.1 导出方式

```JavaScript
exports["calculator"] = (function (modules) {}({})
```

#### 6.2.2 使用方式

```JavaScript
let main = require('./main');
console.log(main.calculator.add(1,2));
```

```JavaScript
require('npm-name')['calculator'].add(1,2);
```

> npm-name 是指模块发布到 Npm 代码仓库时的名称

### 6.3 commonjs2

编写的库将通过 CommonJS 规范导出。

和 commonjs 的区别就是导出方式的不同，一个是 exports.xxx= xxx；一个是 module.exports = xxxx

#### 6.3.1 导出方式

```JavaScript
module.exports = (function (modules) {}({})
```

#### 6.3.2 使用方式

```JavaScript
require('npm-name').add();
```

> 在 output.libraryTarget 为 commonjs2 时，配置 output.library 将没有意义。

### 6.4 this

编写的库将通过 this 被赋值给通过 library 指定的名称，输出和使用的代码如下：

#### 6.4.1 导出方式

```JavaScript
this["calculator"]= (function (modules) {}({})
```

#### 6.4.2 使用方式

```JavaScript
this.calculator.add();
```

### 6.5 window

编写的库将通过 window 被赋值给通过 library 指定的名称，即把库挂载到 window 上，输出和使用的代码如下：

#### 6.5.1 导出方式

```JavaScript
window["calculator"]= (function (modules) {}({})
```

#### 6.5.2 使用方式

```JavaScript
window.calculator.add();
window["calculator"]= (function (modules) {}({})
```

### 6.6 global

编写的库将通过 global 被赋值给通过 library 指定的名称，即把库挂载到 global 上，输出和使用的代码如下：

#### 6.6.1 导出方式

```JavaScript
global["calculator"]= (function (modules) {}({})

```

#### 6.6.2 使用方式

```JavaScript
global.calculator.add();
```

### 6.7 umd

```JavaScript
(function webpackUniversalModuleDefinition(root, factory) {
  // commonjs2
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  // amd
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  // commonjs
  else if(typeof exports === 'object')
    exports['MyLibrary'] = factory();
  else
    root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});

```
