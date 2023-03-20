// css文本代码 export default
const path = require("path");

function normalize(path) {
  return path.replace(/\\/g, "/");
}

// loader函数就为空，不做任何处理
function loader(source) {}

loader.pitch = function (remainingRequest) {
  // 现在我们的请求格式  style-loader!less-loader!index.less
  // style.innerHTML = require("!!../loader/less-loader.js!./index.less");
  let script = `
      let style = document.createElement('style');
      style.innerHTML = require(${stringifyRequest(this, remainingRequest)});
      document.head.appendChild(style);
    `;
  console.log(script);
  return script;
};

/*
function stringifyRequest(loaderContext, request) {
  const splitted = request.split("!");
  const { context } = loaderContext;
  return (
    "!!" +
    JSON.stringify(
      splitted
        .map((part) => {
          part = path.relative(context, part);
          if (part[0] !== ".") part = "./" + part;
          // normalize
          return part.replace(/\\/g, "/");
        })
        .join("!")
    )
  );
}
*/

function stringifyRequest(loaderContext, request) {
  let prefixRep = /^-?!+/;
  let prefixResult = request.match(prefixRep);
  let prefix = prefixResult ? prefixResult[0] : "";
  const splitted = request.replace(prefixRep, "").split("!");
  const { context } = loaderContext;
  return (
    "!!" +
    JSON.stringify(
      prefix +
        splitted
          .map((part) => {
            part = path.relative(context, part);
            if (part[0] !== ".") part = "./" + part;
            return part.replace(/\\/g, "/");
          })
          .join("!")
    )
  );
}

module.exports = loader;
