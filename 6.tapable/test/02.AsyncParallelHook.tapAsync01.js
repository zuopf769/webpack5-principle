const { AsyncParallelHook } = require("tapable");
// const { AsyncParallelHook } = require("./tapable");

debugger;

const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");
hook.tapAsync("1", (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    // 只有callback有返回值就会执行最后的回调done，但是剩下的两个钩子的回调仍然会执行
    // 1会被当做error 可以查看src/2.AsyncParallelHook.origin.js
    callback();
  }, 1000);
});
hook.tapAsync("2", (name, age, callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});
hook.tapAsync("3", (name, age, callback) => {
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000);
});

// 不是每次调用tapAsync就动态编译创建新的执行逻辑的方法；而是只有当你调用callAsync方法的时候才会去动态编译
// 动态编译后的this.callAsync方法会被覆盖为hook.callAsync，以后再执行hook.callAsync会重新编译么？
// 用tapable原本的库执行会执行下面添加的'4'
// 那看来tapable执行完hook.callAsync后，会重置，第二次调用hook.callAsync还会重新编译
hook.callAsync("zuopf", 18, () => {
  console.log("done");
  console.timeEnd("cost");
});

// tapAsync会让this.callAsync缓存失效，下次调用callAsync的时候会重新编译
hook.tapAsync("4", (name, age, callback) => {
  setTimeout(() => {
    console.log(4, name, age);
    callback();
  }, 4000);
});

hook.callAsync("zuopf-2", 28, () => {
  console.log("done");
});
