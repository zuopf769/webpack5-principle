(function anonymous(name, age, _callback) {
  "use strict";
  var _context;
  var _x = this._x;
  do {
    var _counter = 3;
    var _done = function () {
      _callback();
    };
    if (_counter <= 0) break;
    var _fn0 = _x[0];
    _fn0(name, age, function (_err0) {
      if (_err0) {
        if (_counter > 0) {
          _callback(_err0);
          _counter = 0;
        }
      } else {
        if (--_counter === 0) _done();
      }
    });
    if (_counter <= 0) break;
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
    if (_counter <= 0) break;
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
  } while (false);
});
