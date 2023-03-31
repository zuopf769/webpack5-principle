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
