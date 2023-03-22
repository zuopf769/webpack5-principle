/**
 * 根据loader的绝对路径创建loader对象
 * @param {*} loaderAbsPath
 */
function createLoaderObject(loaderAbsPath) {
  // 通过require获取loader的模块对应的方法即mormal方法
  const normal = require(loaderAbsPath);
  // pitch是normal方法的静态属性
  const pitch = normal.pitch;
  // 如果设置normal.raw属性为true的话，那么传给loader的normal函数参数就是一个Buffer,否则就是一个字符串
  const raw = normal.raw;
  return {
    path: loaderAbsPath, // 存放着此loader的绝对路径
    normal, // 一定有normal
    pitch, // 不一定有pitch
    raw,
    data: {}, // 每个loader都有一个自已的自定久对象，可以有用来保存和传递数据
    pitchExecuted: false, // 表示此loader的pitch已经执行过了；防止重复执行
    normalExecuted: false, // 表示此loader的normal函数已经执行过了；防止重复执行
  };
}

/**
 * 转换loader的参数
 * @param {*} args 参数
 * @param {*} raw 布尔值，表示loader想要字符串还是想要Buffer
 */
function convertArgs(args, raw) {
  // 二进制但是内容不是二进制就转成二进制
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    // 不是二进制但是内容不是二进制就转成字符串
    args[0] = args[0].toString();
  }
}

// 递归执行loader的normal方法
function iterateNormalLoaders(
  processOptions,
  loaderContext,
  args,
  pitchingCallback
) {
  // 执行到了最左侧的loader后，就执行finalCallback
  if (loaderContext.loaderIndex < 0) {
    // err 是null，发生异常的时候才有err对象
    return pitchingCallback(null, args);
  }
  // 取出当前index对应的loader
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.normalExecuted) {
    // 继续向左执行loader的normal函数
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      pitchingCallback
    );
  }
  // loader一定有normal方法，所以不用判断是否存在normal方法
  let fn = currentLoader.normal; // 就是loader里的normal函数
  currentLoader.normalExecuted = true;
  // 转换参数
  convertArgs(args, currentLoader.raw);
  // 要以同步或者异步的方式执行fn
  // returnArgs是多个参数还是一个参数；同步的是一个，异步的由用户控制可能是一个也可能是多个
  runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
    // 只返回err，没有result
    if (err) pitchingCallback(err);
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      returnArgs,
      pitchingCallback
    );
  });
}

// 以同步或者异步的方式执行fn
function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  let isSync = true; // 默认fn的的执行是同步
  let isDone = false; // 表示当前的函数是否已经完成了

  // 下面this.async返回的callback
  // 在自定义loader中可以回传的args可以传多个值，都rest到args这个数组中
  // 自定义loader如果是异步，不会立刻调用runCallback,需要你在自定义loader的内部手工触发callback,然后执行runCallback
  loaderContext.callback = (err, ...args) => {
    // callback已经调用过就不能再调用了
    if (isDone) {
      throw new Error("callback(): The callback was already called.");
    }
    isDone = true;
    // 把多个args传递下去，因为异步的callback是在自定义loader中由用户控制的，所以可能是多个
    runCallback(err, ...args);
  };

  // 自定义loader中调用this.async返回一个callback
  loaderContext.async = () => {
    // 同步变成异步
    isSync = false;
    return loaderContext.callback;
  };

  // 真正执行fn，给fn绑定this是loaderContext；所以自定义loader中的this就是loaderContext
  let result = fn.apply(loaderContext, args);

  // 如果当前的执行是同步的话，手动执行runCallback
  // 如果是异步，不会立刻调用runCallback,需要你在自定义loader的内部手工触发callback,然后执行runCallback
  if (isSync) {
    isDone = true;
    // 同步的返回值一般是个字符串，所以只能是一个
    runCallback(null, result);
  }
}

// pitch执行完毕后，读取文件
function processResource(processOptions, loaderContext, pitchingCallback) {
  // readResource => fs.readFile
  processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
    processOptions.resourceBuffer = resourceBuffer; //要加载的资源的二进制数组 Buffer
    // index已经越界
    loaderContext.loaderIndex--;
    // 读完文件后再从右往左执行normal方法
    iterateNormalLoaders(
      processOptions,
      loaderContext,
      [resourceBuffer],
      pitchingCallback
    );
  });
}

// 为啥不采用循环，而采用递归？避免loader执行的时候索引导致的混乱？
function iteratePitchingLoaders(
  processOptions,
  loaderContext,
  pitchingCallback
) {
  // 当前处理的loaderIndex表明是最后一个loader
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    // 处理源文件
    return processResource(processOptions, loaderContext, pitchingCallback);
  }
  // 获取当前索引对应的loader对象
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  // 如果当前loader的pitch处理过，接着递归执行下一个loader的pitch方法
  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++;
    // 递归执行下一个loader的pitch方法;
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }

  // 获取当前loader对应的pitch函数，可能有，也可能没有
  let fn = currentLoader.pitch;
  // 标识当前loader的pitch方法已经执行完毕；因为我们要保证一个loader pitch或者说normal只走一次
  currentLoader.pitchExecuted = true;
  // 如果当前loader不存在pitch方法；就执行下个loader的pitch方法
  if (!fn) {
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }

  // 如果当前loader存在pitch方法；以同步或者异步的方式执行fn
  runSyncOrAsync(
    fn,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, ...returnArgs) => {
      // 判断pitch方法的返回值有没有，如果有则跳过后面的loader,返回头执行前一个loader
      if (returnArgs.length > 0 && returnArgs.some((item) => item)) {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(
          processOptions,
          loaderContext,
          args,
          pitchingCallback
        );
      } else {
        return iteratePitchingLoaders(
          processOptions,
          loaderContext,
          pitchingCallback
        );
      }
    }
  );
}

/**
 * loader不管有没有异步，都是执行完一个loader才能执行下一个loader
 *
 * @param {*} options
 * @param {*} finalCallback 终极callback
 */
function runLoaders(options, finalCallback) {
  // resource要处理的资源，或者说要编译的模块路径
  // loaders处理此路径的loaders
  // context指的是loader函数在执行的时候this指针
  // readResource读取文件的方法fs.readFile
  const { resource, loaders = [], context = {}, readResource } = options;
  // loaders现在是一个loader模块的绝对路径，转成一个对象
  const loaderObjects = loaders.map(createLoaderObject);
  const loaderContext = context || {}; // 这个对象就是loader执行的时候的this指针
  loaderContext.resource = resource; // 加载的模块
  loaderContext.readResource = readResource; // 读取文件的方法
  loaderContext.loaders = loaderObjects; // 存放loaders对象数组
  loaderContext.loaderIndex = 0; // 当前正在处理的loader的索引，方便从左到右执行pitch，从右向左执行normal
  loaderContext.callback = null; // 可以手工调用此方法向后执行下一个loader
  loaderContext.async = null; // 可以把loader运行从同步变为异步,并返回this.callback

  // 为啥要用 Object.defineProperty? 要给loaderContext上下文对象定义属性；该属性需要一个getter来计算
  // 代表整个请求路径，包括所有的loader+资源 loader-1！loader2!a.js
  Object.defineProperty(loaderContext, "request", {
    get() {
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      // 所有的loader加上resouce
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(loaderContext.resource) // 拼接资源
        .join("!");
    },
  });

  // 从当前的loader下一个开始一直到结束 ，加上要加载的资源
  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  // 从当前的loader开始一直到结束 ，加上要加载的资源
  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  // 从第一个到当前的loader的前一个
  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      // 把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .join("!");
    },
  });

  // 每个loader上都有一个data属性
  Object.defineProperty(loaderContext, "data", {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });

  const processOptions = {
    readResource, // fs.readFile
    resourceBuffer: null, // 要读取的资源的源代码，它是一个Buffer,就二进制字节数组
  };

  // 1. 先从左往右迭代执行pitch方法
  // 2. 读文件
  // 3. 最后从右往左执行normal方法
  /**
   *  processOptions
   *  loaderContext  上下文
   *  pitchingCallback loader都执行完执行的回调，不是说pitch执行完就执行的回调，是normal也执行完的时候调用的回调
   */
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    // pitchingCallback中调用finalCallback
    finalCallback(err, {
      result, // 是最终处理的结果 ,其实就是最左则的loader的normal 返回值
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

exports.runLoaders = runLoaders;
