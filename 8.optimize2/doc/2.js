function createHash() {
  return require("crypto").createHash("md5");
}

//入口
let entry = {
  entry1: "entry1.js", //模块entry1
  entry2: "entry2.js", //模块entry2
};

// 入口文件的内容
let entry1Content = `require('depModule1)'`; //模块depModule1
// let entry1Content = `require('depModule1'`; //模块depModule1
let entry2Content = `require('depModule2)'`; //模块depModule2
// let entry2Content = `require('depModule2'`; //模块depModule2

// 入口依赖的模块
let depModule1 = "depModule1";
// let depModule1 = ")depModule1"; // 把小括号）从上面挪到了下面，因为内容没发生变化，ContentHash也不会发生变化
let depModule2 = "depModule2";
// let depModule2 = ")depModule2";

//如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效
let hash = createHash()
  .update("entry1Content") // 往里面输入内容
  .update("entry2Content")
  .update("depModule1")
  .update("depModule2")
  .digest("hex")
  .slice(0, 8);
//hash 72cbd1e1 说明打过包过程的任何文件发生改变，hash值都会变
console.log("hash", hash);

//chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。

//在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
let entry1ChunkHash = createHash()
  .update("entry1Content")
  .update("depModule1")
  .digest("hex")
  .slice(0, 8);
console.log("entry1ChunkHash", entry1ChunkHash);

// entry2ChunkHash只依赖entry2Content和depModule2；和entry1Content、depModule1没有关系，互不影响
let entry2ChunkHash = createHash()
  .update("entry2Content")
  .update("depModule2")
  .digest("hex")
  .slice(0, 8);
console.log("entry2ChunkHash", entry2ChunkHash);

let entry1ContentHash = createHash()
  .update(entry1Content + depModule1)
  .digest("hex")
  .slice(0, 8);
console.log("entry1ContentHash", entry1ContentHash);

let entry2ContentHash = createHash()
  .update(entry2Content + depModule2)
  .digest("hex")
  .slice(0, 8);
console.log("entry2ContentHash", entry2ContentHash);
