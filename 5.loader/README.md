# webpack loader 原理

## 1.loader

- 所谓 `loader` 只是一个导出为函数的 `JavaScript` 模块。它接收上一个 `loader` 产生的结果或者资源文件(`resource file`)作为入参。也可以用多个 `loader` 函数组成 `loader chain`
- 最右侧的`loader`拿到是是资源文件，最左侧的`loader`产生`wepack`能识别的代码如`js`或者`json`
- `compiler` 需要得到最后一个 `loader` 产生的处理结果。这个处理结果应该是 `String` 或者 `Buffer`（被转换为一个 `string`）

### 1.1 loader 运行的总体流程

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/17/09-44-45-f0f65803c9b06fccd34bd8b280e3005f-20230317094443-49cc65.png)

### 1.2 loader-runner

- [loader-runner](https://github.com/webpack/loader-runner#readme)是一个执行 loader 链条的的模块

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/17/09-46-24-e130ce26b376a46cf06e3849fbb2fa8a-20230317094622-2e4191.png)

### 1.2.1 loader 类型

- [loader 的叠加顺序](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L159-L339) = post(后置)+inline(内联)+normal(正常)+pre(前置)

### 1.2.2 执行流程

```js
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
  path.resolve(__dirname, "loaders-chain", loader);
//把loader数组从名称变成绝对路径
loaders = loaders.map(resolveLoader);

runLoaders(
  {
    resource, //你要加载的资源
    loaders,
    context: { name: "zhufeng", age: 100 }, //保存一些状态和值
    readResource: fs.readFile.bind(this),
  },
  (err, result) => {
    console.log(err);
    console.log(result.result[0].toString()); //转换后的结果
    //转换前源文件的二进制内容
    console.log(result.resourceBuffer);
    console.log(
      result.resourceBuffer ? result.resourceBuffer.toString() : null
    );
  }
);
```

自定义 loader

> loaders-chain-bak1

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/17/11-05-02-a39c63779e4b39e58da94a4660791bb0-20230317110501-85c03f.png)

## 1.3 特殊配置

- [loaders/#configuration](https://webpack.js.org/concepts/loaders/#inline)

| 符号 | 变量                 | 含义                                    | 含义                                                                                     |
| ---- | -------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| -!   | noPreAutoLoaders     | 不要前置和普通 loader                   | Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders |
|      |
| !    | noAutoLoaders        | 不要普通 loader                         | Prefixing with ! will disable all configured normal loaders                              |
| !!   | noPrePostAutoLoaders | 不要前后置和普通 loader,只要内联 loader | Prefixing with !! will disable all configured loaders (preLoaders, loaders, postLoaders) |
|      |

## 1.4 pitch

- 比如 `a!b!c!module`, 正常调用顺序应该是 `c、b、a`，但是真正调用顺序是 `a(pitch)、b(pitch)、c(pitch)、c、b、a`,如果其中任何一个 `pitching loader` 返回了值就相当于在它以及它右边的 `loader `已经执行完毕
- 比如如果 `b` 返回了字符串"result b", 接下来只有 `a` 会被系统执行，且 `a` 的 `loader` 收到的参数是 `result b`
- `loader` 根据返回值可以分为两种，一种是返回 `j`s 代码（一个 `module` 的代码，含有类似 `module.export` 语句）的 `loader`，还有不能作为最左边 `loader` 的其他 `loader`
- 有时候我们想把两个第一种 `loader chain` 起来，比如 `style-loader!css-loader!` 问题是 `css-loader` 的返回值是一串 `js` 代码，如果按正常方式写 `style-loader` 的参数就是一串代码字符串
- 为了解决这种问题，我们需要在 `style-loader` 里执行 `require(css-loader!resources)`

pitch 与 loader 本身方法的执行顺序图

```shell
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

![](https://raw.githubusercontent.com/retech-fe/image-hosting/main/img/2023/03/17/15-00-24-e2f784f29c6273ce0efc92edf16ab6aa-20230317150024-82ffe9.png)
