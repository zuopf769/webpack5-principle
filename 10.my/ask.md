## loader 都在 complier 中的 run 方法中执行 时机比 plugin 早?

- 进来就挂载 plugin 了，看来 plugin 的挂载比 loader 早
- 看来 loader 都在 complier 中的 run 方法中执行 时机比 plugin 早

plugin 是贯穿整个生命周期的
plugin 分为注册和触发二个环节
刚开始就全部注册了,但是这个时候插件函数并没有触发执行
而是在执行编译的过程中,逐渐执行
loader 只是中间小的一个环节

### 1.如果 1 和 4 都依赖 3 的话，3 会被打包两次么？3 的 name 是啥

2.有个项目，客户要求单个 js 不能超过 200k，但是我用 webpack 打包之后大概 1M，这个怎么拆分啊？
