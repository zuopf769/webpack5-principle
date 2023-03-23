const { AsyncParallelHook } = require("tapable");

// 异步并行执行钩子
const hook = new AsyncParallelHook(["name", "age"]);

// 并行执行
// 一起开始执行，一起结束类似Promise.all方法

//异步的hook，注册方式有3种  tap tapAsync tapPromise

// tap 同步注册
/* 
hook.tap('1', (name,age) => {
  console.log(1, name, age);
});
hook.tap('2', (name,age) => {
  console.log(2, name, age);
});
hook.tap('3', (name,age) => {
  console.log(3,name,age);
});
//触发就没有call callAsync promise
hook.callAsync('zuopf', 18, () => {
  console.log('done');
}); 
*/

// tapAsync 异步注册，全部任务完成后执行最终的回调
/* 
console.time('cost');
// setTimeout异步钩子需要传入callback手动执行下一个hook
hook.tapAsync('1', (name,age,callback) => {
  console.log("setTimeout1");
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000);
});
hook.tapAsync('2', (name,age,callback) => {
  console.log("setTimeout2");
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});
hook.tapAsync('3', (name,age,callback) => {
  console.log("setTimeout3");
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000);
});
//触发就没有call callAsync promise
hook.callAsync('zuopf', 18, () => {
  console.log('done');
  console.timeEnd('cost');
}); 
*/

// tapPromise
// promise 注册钩子
// 全部完成后执行才算成功
console.time("cost");
// promoise不需要传入callback，而是执行resolve
hook.tapPromise("1", (name, age) => {
  // 需要返回promise
  return new Promise((resolve, reject) => {
    // 同时执行 console.log("promise1");console.log("promise2");console.log("promise3");
    console.log("promise1");
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000);
  });
});
hook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    console.log("promise2");
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 2000);
  });
});
hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    console.log("promise3");
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});

//触发就没有call 没有callPromise 有promise
hook.promise("zuopf", 18).then(() => {
  console.log("done");
  // 大致花费3秒
  console.timeEnd("cost");
});
