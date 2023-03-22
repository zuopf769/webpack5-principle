const { SyncLoopHook } = require("tapable");

// SyncLoopHook 的特点是不停的循环执行回调函数，直到函数结果等于 undefined
// 要注意的是每次循环都是从头开始循环的;

/**
 * 不停的执行回调函数，直到结果等于undefined
 */
const hook = new SyncLoopHook(["name", "age"]);
let counter1 = 0,
  counter2 = 0,
  counter3 = 0;

hook.tap("1", (name, age) => {
  console.log(1, "counter1", counter1);
  if (++counter1 === 1) {
    counter1 = 0;
    return;
  }
  return true;
});

hook.tap("2", (name, age) => {
  console.log(2, "counter2", counter2);
  if (++counter2 === 2) {
    counter2 = 0;
    return;
  }
  return true;
});

hook.tap("3", (name, age) => {
  console.log(3, "counter3", counter3);
  if (++counter3 == 3) {
    counter3 = 0;
    return;
  }
  return true;
});

hook.call("zhufeng", 18);

//一共15次 12120 12121 12123
// 1 counter1 0
// 2 counter2 0
// 1 counter1 0
// 2 counter2 1
// 3 counter3 0

// 1 counter1 0
// 2 counter2 0
// 1 counter1 0
// 2 counter2 1
// 3 counter3 1

// 1 counter1 0
// 2 counter2 0
// 1 counter1 0
// 2 counter2 1
// 3 counter3 2
