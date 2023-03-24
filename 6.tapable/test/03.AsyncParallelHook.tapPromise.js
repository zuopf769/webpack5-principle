const { AsyncParallelHook } = require("tapable");
// const { AsyncParallelHook } = require("../tapable");

debugger;

const hook = new AsyncParallelHook(["name", "age"]);
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

hook.promise("zuopf", 18).then(
  () => {
    console.log("done");
    console.timeEnd("cost");
  },
  () => {}
);
