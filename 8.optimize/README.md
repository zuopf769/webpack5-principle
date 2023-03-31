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
