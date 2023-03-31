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
