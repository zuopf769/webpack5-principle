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
