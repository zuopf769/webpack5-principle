// 后面多了个参数_callback
function anonymous(name, age, _callback) {
  // header
  var _x = this._x;

  // content
  var _counter = 3;

  var _done = function () {
    _callback();
  };

  // 简化版本把错误处理删掉了
  // 并发执行三个fn，执行完一个就--_counter
  var _fn0 = _x[0];
  _fn0(name, age, function (_err0) {
    if (--_counter === 0) _done();
  });

  var _fn1 = _x[1];
  _fn1(name, age, function (_err1) {
    if (--_counter === 0) _done();
  });

  var _fn2 = _x[2];
  _fn2(name, age, function (_err2) {
    if (--_counter === 0) _done();
  });
}
