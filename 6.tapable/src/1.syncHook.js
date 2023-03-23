// tapable动态编译、动态创建出来的函数
// 在hook.call处打断点可以看到生成的函数内容 hook.call("zuopf", 18);
function anonymous(name, age) {
  // header 函数体的头
  var _x = this._x;

  // content 函数体的内容
  // 取第一个钩子回调fn
  var _fn0 = _x[0];
  // 执行回调fn
  _fn0(name, age);

  var _fn1 = _x[1];
  _fn1(name, age);

  var _fn2 = _x[2];
  _fn2(name, age);
}
