## commonjs 和 commonjs2

- commonjs 就是把导出的对象持到 exports 的属性上
- commonjs2 module.exports

## 生产环境可以 gzip 压缩，就不用用到插件压缩是吧？

nginx 可以配置开启 gzip 压缩；但是仍然需要 webpack 打包的时候插件压缩

原因：

- 插件压缩前 100K
- 压缩后 50K
- GZIP 压缩后 25K

gzip 有 webpack 压缩， 有 nginx 压缩，webpack 压缩后，nginx 就不需要压缩了，可以减少服务器内存

## 多入口处的 vender 单独成一个包吗

- vendor 会成为一个单独的代码块，也会输出成一个单独的文件
- vendor 可以把 lodash 等不会变的类库，单独打出来一个包，

## 如何自动同步打包后的产物到 cdn 上

- 那有了 hash 我们部署到服务器上的文件，会自动同步到 cdn 上吗？
- 这个功能需要自己实现
- 我们可以做一个插件，把打包后的 js 和 css 文件自动上传到 CDN 上

## content hash 不是更合理么 为什么还有这么多种方式呢？

存在就是合理的
不同的方式有优点的有缺点的
hash 优点就是快
contenthash 需要计算结果的内容，计算起来非常的慢

- hash: 每次 webpack 构建时生成一个唯一的 hash 值
- chunkhash: 根据 chunk 生成 hash 值，来源于同一个 chunk，则 hash 值就一样
- contenthash: 根据内容生成 hash 值，文件内容相同 hash 值就相同

## html 不缓存

- 前端的缓存策略
- html 不缓存
- 引入的外链是 CDN 的地址，CDN 地址要带上 hash 并长期缓存

## contenthash 会有修改了内容而不发生变化的情况么？

- 调整一下内容的位置，contenthash 不变这种情况，实际项目里是不是基本不会出现哈？ 9999.99%不会出现
- 不修改任何文件,多次打包的 hash 是一样的么

## deterministic

数字后面也是 hash

## DeterministicModuleIdsPlugin.js 和 HashedModuleIdsPlugin 有啥关系和区别?

生成 id 的不同策略；不同的策略生成的算法不一样

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/04/03/14-32-18-5b7dad2188c7045dfbeba84f593fa565-20230403143217-60b3b6.png)

## 能把 one 和 three 打一起吗

- 一般来说 one two 都是一个天然的代码分割点 ；遇到 import()就是一个分割点
- 可以配置 splitChunksPlugin 来决定哪些分割，哪些合并在一起
