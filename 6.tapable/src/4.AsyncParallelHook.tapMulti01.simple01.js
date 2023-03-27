function anonymous(name, age) {
  var _x = this._x;

  return new Promise(function (_resolve, _reject) {
    var _counter = 3;
    var _done = function () {
      _resolve();
    };

    var _fn0 = _x[0];
    _fn0(name, age);
    if (--_counter === 0) _done();

    var _fn1 = _x[1];
    _fn1(name, age, function (_err1) {
      if (--_counter === 0) _done();
    });

    var _fn2 = _x[2];
    var _promise2 = _fn2(name, age);
    _promise2.then(function (_result2) {
      if (--_counter === 0) _done();
    });
  });
}
