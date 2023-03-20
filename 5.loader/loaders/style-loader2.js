//css文本代码 export default
const path = require("path");

function normalize(path) {
  return path.replace(/\\/g, "/");
}

// loader函数就为空，不做任何处理
function loader(source) {}

loader.pitch = function (remainingRequest) {
  console.log("remainingRequest", remainingRequest);
  console.log("context", this.context); //index.less模块所在的目录 可以用作解析其他模块成员的上下文
  //1.获取剩下的请求
  //2.用!分割得到各个部分的绝对路径前面是loader路径，后面是文件路径
  //3.把路径从绝对路径变成相对于根目录的相对路径
  // 路径的前面要加上!!,只使用行内loader,不使用rule里面配置的loader,不然就会死循环了
  /*   const request = "!!"+(remainingRequest.split('!').map(
    //request => this.utils.contextify(this.context, request)
    //这个路径其实就是模块的ID
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
  console.log("request", request);
  // 原理就是：利用require方法执行less文件转换后的js模块，
  let script = `
     let styleCSS = require(${JSON.stringify(request)});
     let style = document.createElement('style');
     style.innerHTML =styleCSS;
     document.head.appendChild(style);
   `;
  return script;
};
module.exports = loader;
//require("!!../loaders/less-loader.js!./index.less");

/**
[
  C:\aproject\webpack202208\5.loader\loaders\less-loader.js,
  C:\aproject\webpack202208\5.loader\src\index.less
]
request=[
 ./loaders\less-loader.js,
 .\src\index.less
]
 * 
 */

// 现在我们的请求格式  style-loader!less-loader!index.less
// style.innerHTML = require("!!../loader/less-loader.js!./index.less");
// require的导入路径都是相对于根目录的路径
