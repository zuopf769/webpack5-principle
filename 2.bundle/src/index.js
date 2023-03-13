// 异步加载
// import异步加载会作为代码的分割点
import(/* webpackChunkName: "hello" */ './hello').then(result => {
  console.log(result.default)
})
