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

```JavaScript
const bootstrap = path.resolve(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css')
resolve: {
+    alias:{
+        bootstrap
+    }
},
```
