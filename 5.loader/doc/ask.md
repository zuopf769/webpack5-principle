## 包管理

- npm 最干净 最快
- cnpm 快，但是会打断目录结构
- yarn
- pnpm 目前最先进最快的

## runLoaders

- readfile 方法可以不写 bind(fs)
- result.resourceBuffer.toString()是将 buffer 转化为 js 内容吗
- resourceBuffer 存的是二进制的字节 可以通过 toString 转成字符串

## loader 分类

- loader 的分类
- loader 有四种分类，它们的组合是有顺序的
- =post(后置)+inline(内联)+normal(正常)+pre(前置)
- = 厚脸挣钱

## 有个前后 loader 顺序就可以了,为啥还有个中间的?有个中间就算了还要有个 inline 为啥呢?

其实从设计之初

三种就够
一种普通
一种优针级比普通高的
一种是比普通低的

inline 有非常特殊而重要的作用 style-loader 的时候

## 为啥 inlineLoader 不放在 rules 里?

行内和行外
行内是写在 require 里的
写在 rules 行外

## 要想在项目中使用自定义 loader

- 1.可以使用绝对路径 `path.resolve(_dirname,'loader/babel-loader.js')`
- 2.resolveLoader 配置 alias
- 3.resolveLoader 配置 modules

## 为啥 es5 转 es6 是异步的呢？

可以是异步，也可以同步

- fs.readFile 同步
- fs.readFileAsync 异步

## css-loader 的功能

css-loader 是来处理 import 和 url

## pitch 既然会阻断后面文件的读取，那还有什么作用？

- 不 return 只处理逻辑应该可以用 pitch
- 如果你加载的模块是一个虚拟模块，硬盘上根本没有这个文件，也可以用 pitch，不用最后真正的走到文件

当你想把两个返回 commonjs 代码的 loader 级联使用，就需要 pitch 和!!

- loader 根据返回值可以分为两种，一种是返回 js 代码（一个 module 的代码，含有类似 module.export 语句）的 loader，还有不能作为最左边 loader 的其他 loader
- 有时候我们想把两个第一种 loader chain 起来，比如 style-loader!css-loader! 问题是 css-loader 的返回值是一串 js 代码，如果按正常方式写 style-loader 的参数就是一串代码字符串
- 为了解决这种问题，我们需要在 style-loader 里执行 require(css-loader!resources)

## request、remainingRequest、previousRequest、currentRequest

- request = loader1!loader2!loader3!file
- 目前在 loader2
- remainingRequest = loader3!file // 不包括当前所在的 loader
- previousRequest = loader1
- currentRequest = loader2!loader3!file // 包括当前所在的 loader

## this.context 是 啥？

指的是当前加载的模块所在的目录，它并不是根目录，而是当前模块所在的目录
