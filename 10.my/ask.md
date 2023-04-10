## loader 都在 complier 中的 run 方法中执行 时机比 plugin 早?

- 进来就挂载 plugin 了，看来 plugin 的挂载比 loader 早
- 看来 loader 都在 complier 中的 run 方法中执行 时机比 plugin 早

plugin 是贯穿整个生命周期的
plugin 分为注册和触发二个环节
刚开始就全部注册了,但是这个时候插件函数并没有触发执行
而是在执行编译的过程中,逐渐执行
loader 只是中间小的一个环节

## Compiler

- Compiler 是单例
- 第一次或者源码改变后都会创建新的 Compilation
- 编译 Compilation 开始后需要找到入口文件 ./src/index.js
- 从入口文件再找到他们依赖的模块递归编译
- 把入口的所有依赖模块组成一个 chunk；chunk 是一个对象，里面 modules 字段维护着所有的模块
- 最后生成一个 bundle，里面包含 chunk 所有的模块文件

## beforeRun 等钩子只触发不注册？

- webpack 内部没有注册的话，就是可以在自定义钩子中注册
- 不注册不触发可以么？可以

### 1.如果 1 和 4 都依赖 3 的话，3 会被打包两次么？3 的 name 是啥

- 3 会单独一个代码块

### emit 是什么意思

- 发射
- 把打包好的 chunk 生成文件写到硬盘中

### import 动态导入

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/04/10/17-50-08-90e9ef4053bd32f0c835bdc06c4a38f3-20230410175006-073949.png)
