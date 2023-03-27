class HookMap {
  constructor(factory) {
    this._map = new Map();
    this._factory = factory;
  }
  get(key) {
    return this._map.get(key);
  }
  tapAsync(key, options, fn) {
    return this.for(key).tapAsync(options, fn);
  }
  tapPromise(key, options, fn) {
    return this.for(key).tapPromise(options, fn);
  }
  // 按key对钩子进行分组，
  // 使用传入的钩子工厂创建hook
  for(key) {
    // key对应的钩子存在就返回
    const hook = this.get(key);
    if (hook) return hook;

    // 使用工厂创建新的钩子并返回
    let newHook = this._factory();
    this._map.set(key, newHook);
    return newHook;
  }
}

module.exports = HookMap;
