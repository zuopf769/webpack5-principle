const { AsyncSeriesWaterfallHook } = require("tapable");

const hook = new AsyncSeriesWaterfallHook(["name", "age"]);

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
hook.callAsync('zhufeng', 18, () => {
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
hook.callAsync('zhufeng', 18, () => {
  console.log('done');
  console.timeEnd('cost');
}); 
*/

console.time("cost");
hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve("result1");
    }, 1000);
  });
});
hook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve("result2");
    }, 2000);
  });
});
hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
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
