//_callback是callAsync的回调函数
function anonymous(name, age, _callback) {
  var _x = this._x;
  // 数组的长度
  var _counter = 3;

  // 注册的钩子都执行完毕
  var _done = function () {
    // 调用callAsync的回调函数_callback
    _callback();
  };

  // 没有循环，同时开启多个任务_fn0、_fn1、_fn2同时执行

  // 取第一个fn
  var _fn0 = _x[0];
  // fn的第三个参数就是fn的callback
  _fn0(name, age, function (_err0) {
    // 如果有错误
    if (_err0) {
      // 如果有错误并且还有没执行完的回调钩子就执行callAsync的回调函数
      // 因为后面的fn2还会执行，但是有一个把
      if (_counter > 0) {
        _callback(_err0);
        // 把_counter设置为0，即使下个回调发生了异常，也不会执行_callback了
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });

  var _fn1 = _x[1];
  _fn1(name, age, function (_err1) {
    if (_err1) {
      if (_counter > 0) {
        _callback(_err1);
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });

  var _fn2 = _x[2];
  _fn2(name, age, function (_err2) {
    if (_err2) {
      if (_counter > 0) {
        _callback(_err2);
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });
}
