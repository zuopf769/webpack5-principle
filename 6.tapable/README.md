# tapable

## 1. webpack 的插件机制

- 在具体介绍 webpack 内置插件与钩子[可视化工具](https://www.npmjs.com/package/wepback-plugin-visualizer)之前，我们先来了解一下 webpack 中的插件机制。 webpack 实现插件机制的大体方式是：

* 创建 - webpack 在其内部对象上创建各种钩子；
* 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
* 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。

- Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例
- 通过事件和注册和监听，触发 webpack 生命周期中的函数方法

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

## 2. tapable 分类

### 2.1 按同步异步分类

- Hook 类型可以分为同步 Sync 和异步 Async，异步又分为并行和串行

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-50-08-5e4890b1ffccae14b7f9dad3da4f98e5-20230322165007-16501a.png)

### 2.2 按返回值分类

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-51-05-29a89155fccc7f59f58def7e7fe848fc-20230322165105-d73df3.png)

### 2.2.1 Basic

- 执行每一个事件函数，不关心函数的返回值,有 SyncHook、AsyncParallelHook、AsyncSeriesHook

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-57-23-ee333a91b20555959541ee8281d67527-20230322165722-f5e00c.png)

### 2.2.2 Bail 保险

- 执行每一个事件函数，遇到第一个结果 result !== undefined 则返回，不再继续执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook
- 通俗的解释：要不到值就问下家要、要不到就下家接着要，要到了就退出了；某个方法有返回值了，就不再往后要值了，直接退出了

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/16-56-57-948f7d8f960ec9c10ce077012f0d87c1-20230322165656-ee5a98.png)

### 2.2.3 Waterfall 瀑布

- 如果前一个事件函数的结果 result !== undefined,则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook
- 通俗的解释：上一个函数的结果会做为下一个函数的参数；如果上一个函数没返回值，则下一个函数的参数还是上上个返回的值

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/17-46-56-64b9fa50d063ffc2e2c99b9a8dda1191-20230322174655-b70c6c.png)

### 2.2.4 Loop

- 不停的循环执行事件函数，直到所有函数结果 result === undefined,有 SyncLoopHook 和 AsyncSeriesLoopHook
- 同俗的解释：碰到某个函数返回值不是 undefined 就从头开始循环

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/22/19-28-19-3ebee1baa5af89e5e6a4c6a481d630d7-20230322192818-ab8376.png)

## 3.使用
