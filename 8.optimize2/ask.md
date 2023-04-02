## commonjs 和 commonjs2

- commonjs 就是把导出的对象持到 exports 的属性上
- commonjs2 module.exports

## gzip 压缩

生产环境可以 gzip 压缩，就不用用到插件压缩是吧
nginx 开启 gzip 压缩

插件压缩前 100K
压缩后 50K
GZIP 压缩后 25K

16:25
sunShine
【loadsh】 不是很懂

爱吃橘子
vender 是啥
Tony
gzip 有 webpack 压缩， 有 nginx 压缩，webpack 压缩后，nginx 就不需要压缩了，可以减少服务器内存

100K
webpack 50K
gzip 25K

vender 单独成一个包吗

vendor 会成为一个单独的代码块，也会输出成一个单独的文件

16:38
ZhangLe
那有了 hash 我们部署到服务器上的文件，会自动同步到 cdn 上吗？
这个功能需要自己实现
我们可以做一个插件，把打包后的 js 和 css 文件自动上传到 CDN 上

shine
content hash 不是更合理么 为什么还有这么多种方式呢？

存在就是合理的
不同的方式有优点的有缺点的
hash 优点就是快
contenthash 需要计算结果的内容，计算起来非常的慢

这是前端的缓存策略之一吧
html 不缓存，引入的外链是 CDN 的地址，CDN 地址要带上 hash 并长期缓存

17:02
jialingling
老师，刚刚总结 hash 的时候，最后讲的那个例子，调整一下内容的位置，contenthash 不变这种情况，实际项目里是不是基本不会出现哈？ 9999.99%不会出现
qq
不修改任何文件,多次打包的 hash 是一样的么

123 撤回了一条消息
123
数字后面也是 hash
帅超超
和 HashedModuleIdsPlugin 有啥关系和区别

123 撤回了一条消息
123
数字后面也是 hash
帅超超
DeterministicModuleIdsPlugin.js
和 HashedModuleIdsPlugin 有啥关系和区别
123
没写代码 都 500 多个字节
shine
我能把 one 和 three 打一起吗
一般来说 one two 都是一个天然的代码分割点 splitChunksPlugin
123
现在已经是在讲联邦模块了吗
shine
你醒醒
20:12
123
这咋搜进 node——modules 里面的
