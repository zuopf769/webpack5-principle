function anonymous(name, age) {
  var _x = this._x;
  var _taps = this.taps;
  var _interceptors = this.interceptors;

  // 拦截器call只会执行一次
  // 有几个interceptor就执行几次
  _interceptors[0].call(name, age);
  _interceptors[1].call(name, age);

  // tapInfo
  var _tap0 = _taps[0];
  // 拦截器tap每个钩子都会执行一次
  _interceptors[0].tap(_tap0);
  _interceptors[1].tap(_tap0);
  // 执行函数
  var _fn0 = _x[0];
  _fn0(name, age);

  var _tap1 = _taps[1];
  _interceptors[0].tap(_tap1);
  _interceptors[1].tap(_tap1);
  var _fn1 = _x[1];
  _fn1(name, age);
}
