## 异步串行怎么感觉和同步是一样的？

task1 task2 task3

- 相同点 都是一个一个来，
- 不同点 同步里不能出现异步代码 setTimeout,异步串行就可以使用异步代码 promise async await setTimeout

## 那如果 SyncHook 中某一个有返回值，这个返回值是不是被忽略了

是的

## resolve('result 2') 的返回值就不再是一个 promise 了，是一个常量，所以结束，不往下执行了，对吗？

只要有结果就行

## this.header() + this.content(）的时候，content()方法不就是定义在子类里面么？

是的
最终创建的使用的 都是子类的实例，所以都可以调用

## 为啥不在 call 方法内部排序

为了性能
如果你连续调用 100 次的 call
排序 100 次。排序性能是非常差的 `nlog(n)`

## 你在插入的时候排好序

在 call 的时候就不需要排序了
