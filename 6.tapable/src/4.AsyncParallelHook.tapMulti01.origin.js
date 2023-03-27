(function anonymous(name, age) {
  "use strict";
  var _context;
  var _x = this._x;
  return new Promise(function (_resolve, _reject) {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(
          Promise.resolve().then(function () {
            throw _err;
          })
        );
      else _reject(_err);
    }
    do {
      var _counter = 3;
      var _done = function () {
        _resolve();
      };
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasError0 = false;
      try {
        _fn0(name, age);
      } catch (_err) {
        _hasError0 = true;
        if (_counter > 0) {
          _error(_err);
          _counter = 0;
        }
      }
      if (!_hasError0) {
        if (--_counter === 0) _done();
      }
      if (_counter <= 0) break;
      var _fn1 = _x[1];
      _fn1(name, age, function (_err1) {
        if (_err1) {
          if (_counter > 0) {
            _error(_err1);
            _counter = 0;
          }
        } else {
          if (--_counter === 0) _done();
        }
      });
      if (_counter <= 0) break;
      var _fn2 = _x[2];
      var _hasResult2 = false;
      var _promise2 = _fn2(name, age);
      if (!_promise2 || !_promise2.then)
        throw new Error(
          "Tap function (tapPromise) did not return promise (returned " +
            _promise2 +
            ")"
        );
      _promise2.then(
        function (_result2) {
          _hasResult2 = true;
          if (--_counter === 0) _done();
        },
        function (_err2) {
          if (_hasResult2) throw _err2;
          if (_counter > 0) {
            _error(_err2);
            _counter = 0;
          }
        }
      );
    } while (false);
    _sync = false;
  });
});
