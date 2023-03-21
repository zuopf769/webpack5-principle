//css文本代码 export default
const path = require("path");

function normalize(path) {
  return path.replace(/\\/g, "/");
}

// loader函数就为空，不做任何处理
function loader(source) {}

loader.pitch = function (remainingRequest) {
  console.log("remainingRequest", remainingRequest); // 绝对路径
  console.log("context", this.context); // index.less模块所在的目录 可以用作解析其他模块成员的上下文
  // 1.获取剩下的请求
  // 2.用!分割得到各个部分的绝对路径前面是loader路径，后面是文件路径
  // 3.把路径从绝对路径变成相对于根目录的相对路径
  // 路径的前面要加上!!,只使用行内loader,不使用rule里面配置的loader,不然就会死循环了
  /*
    const request = "!!"+(remainingRequest.split('!').map(
      // request => this.utils.contextify(this.context, request)
      // 这个路径其实就是模块的ID，模块id就是当前文件相对于根目录的相对目录
      requestAbsPath => ("./" + path.posix.relative(normalize(this.context), normalize(requestAbsPath)))
    ).join('!'));
    console.log('request', request);
   */
  const request =
    "!!" +
    remainingRequest
      .split("!")
      .map((request) => this.utils.contextify(this.context, request))
      .join("!");
  console.log("request", request); // 相对路径
  // 要解决的问题：怎么样才能拿到css的内容呢？
  // 原理就是：利用require方法加载一个多个内联loader链接处理的文件模块；那么该模块文件内容就会经过多个内联loader处理，可以看看webpack编译工作流
  let script = `
     let styleCSS = require(${JSON.stringify(request)});
     let style = document.createElement('style');
     style.innerHTML =styleCSS;
     document.head.appendChild(style);
   `;
  // pitch返回了内容，后面的loader的mormal不会走了
  return script;
};
module.exports = loader;

// 解析入口文件index.js, 该模块依赖模块是index.less，然后递归解析index.less模块
// 新根据wepack配置的loader走一次less-loader和style-loader，但是style-loader有pitch，先走style-loader的pitch（如果有返回值，就不走后门的less-loader了）
// style-loader的pitch返回了require(${JSON.stringify(request)})就是下面的
// require("!!../loaders/less-loader.js!./index.less");
// require("!!../loaders/less-loader.js!./index.less")这个代码给了webpack，告诉webpack我又注意是又想加载index.less这个模块;
// webpack在解析index.less模块的时候然后只用执行!!行内的less-loader，less-loader没有pitch，只有normal，所以就调用less-loader对less进行解析
// 调用less-loader的normal函数后返回的模块字符串；
// require方法会根据模块id读取模块的具体内容，就是css的字符串

// 为啥要加!!，只走inline-loader，避免死循环
// 为啥会死循环？
// 因为走了两次less-loader
// 为啥会走两次less-loader？
// 第一次index.js依赖.index.less，根据webpack配置的loader要走一次（虽然因为style-loader有pitch并且返回值了，没走，但是要走一次）
// 第二次因为sytle-loader的pitch返回的模块字符串中又有require("!!../loaders/less-loader.js!./index.less");所以webpack又要解析index.less
// 第二次用!!限制了不走webpack的配置的loader，而是只走inline-loader，所以webpack只会执行less-loader
// 如果第二次没有用!!，webpack就会走webpck.config中的less-loader, style-loader, 先走style-loader的pitch，然后又返回字符串，字符串中又有require("!!../loaders/less-loader.js!./index.less")
// 这样就死循环了

// 由绝对路径转换成了相对路径
/**
 *
[
  C:\aproject\webpack202208\5.loader\loaders\less-loader.js,
  C:\aproject\webpack202208\5.loader\src\index.less
]

request=[
 .\loaders\less-loader.js,
 .\src\index.less
]
 * 
 */

// 现在我们的请求格式  style-loader!less-loader!index.less
// style.innerHTML = require("!!../loader/less-loader.js!./index.less");
// require的导入路径都是相对于根目录的路径

// 解决问题的原理是：
// 1. 从webpack的工作流程来分析，入口文件先经过匹配到后缀的loader处理，并且利用ast分析出本模块的依赖其他模块
// 2. 递归本模块的依赖继续走步骤1
// 3. 所以本解决思路是：本模块require('内联loader路径!文件名称')；'内联loader路径!文件名称'表示一个模块，所以会当作一个模块，然后经过内联loader处理。
