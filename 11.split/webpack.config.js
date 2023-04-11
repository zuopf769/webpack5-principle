module.exports = {
  mode: "development",
  devtool: false,
  //main是我们入口代码块的名称，至少会有一个main代码块，会有一个main.js文件
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
    page3: "./src/page3.js",
  },
  optimization: {
    splitChunks: {
      // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
      // initial是同步： require import xxx
      // async是异步： import()
      // all是同步加异步
      // 默认只分割异步 async
      chunks: "all", // all也会分割同步
      maxAsyncRequests: 3, // 按需加载文件时，并行的最大异步请求数量 默认为3
      maxInitialRequests: 5, // 加载入口文件时，并行的最大同步请求数量 默认为5
      minSize: 0, // 被分割代码的大小，默认是30k
      // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
      automaticNameDelimiter: "~",
      // 缓存组，设置不同的缓存组来抽取满足不同规则的chunk
      // 优先级为啥事负数：webpack内部还有一些缓存组，他们的priority是0，不能比他们高
      // 缓存组里面的配置项也可以在上面配置，外面是全部；里面只适用于当前缓存组
      cacheGroups: {
        // 第三方提供者，这个名字是随便给的
        // webpack内置的缓存组里面有vendors和default这两个name
        // 自己配置了vendors相当于是覆盖webpack内置的vendors缓存组，如果你的优先级没有内置的高就走内置的vendors缓存组了
        vendors: {
          test: /[\\/]node_modules[\\/]/, //条件；如果模块的路径里有node_modules的话就属于这个vendor缓存组
          priority: -10, // 优先级，解决两个条件都满足的情况下，修改优先级；数字越大优先级越高
        },
        // 抽取不同代码代码块之间的公共代码；这个名字是随便给的
        commons: {
          minChunks: 2, // 被多少模块共享,在分割之前模块的被引用次数；如果这个模块被2个或者2个以上的代码块引用了，就可以单独提取出来
          // minSize: 8, // 被分割代码的大小，默认是30k
          priority: -20,
          // reuseExistingChunk: true, // 如果能重用，就不会再生成一个新的common代码块了，直接重用main.js
        },
      },
      //把运行时当成一个代码块进行单独提取
      //runtime 为了让打包后的代码在浏览器里能运行 模拟一个require方法 这个就叫运行
      //可以把runtimeChunk设置为true就可以把运行时代码块单独提取，实现长期缓存
      //因为运行时代码只是一个工具代码，跟业务无关，不管你的业务如何写，它始终不变
      runtimeChunk: true,
    },
  },
};
