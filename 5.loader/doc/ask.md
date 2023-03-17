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
