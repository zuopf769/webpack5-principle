const { AsyncParallelBailHook } = require("tapable");

// 异步并行保险钩子

/**
 * 所有钩子一起开始执行，碰到返回值不为undefined的钩子，就执行done
 * 带保险的异步并行执行钩子
 * 有一个任务返回值不为空就直接结束
 * 对于promise来说，resolve还reject并没有区别;区别在于你是否传给它们的参数;
 */

const hook = new AsyncParallelBailHook(["name", "age"]);

//异步的hook，注册方式有3种  tap tapAsync tapPromise
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

/* 
console.time('cost');
hook.tapAsync('1', (name,age,callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000);
});
hook.tapAsync('2', (name,age,callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});
hook.tapAsync('3', (name,age,callback) => {
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

console.time("cost");
hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
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
      resolve("result2");
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

//触发就没有call callAsync promise
hook.promise("zuopf", 18).then(() => {
  console.log("done");
  console.timeEnd("cost");
});
