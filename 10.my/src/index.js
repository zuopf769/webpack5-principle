// ------------测试同步---------------------

// 1. 同步require模块
// let title = require("./title");
// console.log(title);

// ------------测试异步---------------------

// 先处理底下的两个动态异步模块title和sum，然后再处理自己的同步依赖sync

// --同步模块
let sync = require("./sync");
console.log(sync);

// --异步模块

// 2. 动态import；import()是天然的一个代码分割点；遇到import()就会把import的模块分割出一个代码块；和main代码块区分开
// import()的模块会成为一个单独的入口，会生成一个单独的代码块
// 如果import调用了一个模块，那么这个模块和它依赖的模块会合成一个单独的异步模块；里面所以模块的async都是true
// 魔法注释/* webpackChunkName: "title" */
import(/* webpackChunkName: "title" */ "./title").then((result) =>
  console.log(result.default)
);

import(/* webpackChunkName: "sum" */ "./sum").then((result) =>
  console.log(result.default)
);

// ------------测试第三方模块---------------------

const isarray = require("isarray");
console.log(isarray([1, 2, 3]));

// -------------测试css文件--------------------------------

require("./index.less");
