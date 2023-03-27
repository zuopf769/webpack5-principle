(function anonymous(name, age, _callback) {
  var _x = this._x;

  var _counter = 3;
  var _done = function () {
    _callback();
  };

  // tap注册钩子执行
  var _fn0 = _x[0];
  _fn0(name, age);
  // 执行完同步函数需要判断是是否注册的钩子全都执行完毕，因为可能只注册一个同步钩子
  if (--_counter === 0) _done();

  // callback注册钩子执行
  var _fn1 = _x[1];
  _fn1(name, age, function () {
    if (--_counter === 0) _done();
  });

  // promise注册钩子执行
  var _fn2 = _x[2];
  var _promise2 = _fn2(name, age);
  _promise2.then(function () {
    if (--_counter === 0) _done();
  });
});
