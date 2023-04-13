function render() {
  let title = require("./title.js");
  root.innerText = title;
}
// 先调一次render
render();

if (module.hot) {
  // title.js模块发生修改的时候，会执行render方法这个回调函数
  module.hot.accept(["./title.js"], render);
}
