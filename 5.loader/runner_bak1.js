const { runLoaders } = require("loader-runner");
const path = require("path");
const fs = require("fs"); //webpack-dev-server启开发服务器的时候 memory-fs

// entry入口
const entryFile = path.resolve(__dirname, "src/index.js");

// 如何配置行内loader
let request = `inline-loader1!inline-loader2!${entryFile}`;

let rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"], // normal-loader
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post-loader1", "post-loader2"], // post-loader
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre-loader1", "pre-loader2"], // pre-loader
  },
];

// inline loader的Prefixing with  https://webpack.js.org/concepts/loaders/#inline
// Prefixing ! !! -!
let parts = request.replace(/^-?!+/, "").split("!");
let resource = parts.pop(); //弹出最后一个元素 entryFile=src/index.js
let inlineLoaders = parts; //[inline-loader1,inline-loader2]
let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}

// 保证顺序-从下往上执行
let loaders = [
  ...postLoaders,
  ...inlineLoaders,
  ...normalLoaders,
  ...preLoaders,
];

// 对标webpack的resolveloader
// https://webpack.js.org/configuration/resolve/#resolveloader
let resolveLoader = (loader) =>
  path.resolve(__dirname, "loaders-chain-bak1", loader); // "loaders-chain"注意这里的目录切换成相应的路径
// 把loader数组从名称变成绝对路径
loaders = loaders.map(resolveLoader);

runLoaders(
  {
    resource, // 你要加载的资源
    loaders,
    context: { name: "zuopf769", age: 30 }, // 保存一些状态和值
    readResource: fs.readFile.bind(this),
  },
  (err, result) => {
    console.log(err);
    console.log(result.result[0].toString()); // 转换后的结果
    // 转换前源文件的内容
    console.log(result.resourceBuffer);
    // 将buffer转化为字符串内容吗
    console.log(
      result.resourceBuffer ? result.resourceBuffer.toString() : null
    );
  }
);
