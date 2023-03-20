/**
 * 根据loader的绝对路径创建loader对象
 * @param {*} loaderAbsPath
 */
function createLoaderObject(loaderAbsPath) {
  const normal = require(loaderAbsPath);
  const pitch = normal.pitch;
  //如果设置normal.raw属性为true的话，那么loader的normal函数参数就是一个Buffer,否则就是一个字符串
  const raw = normal.raw;
  return {
    path: loaderAbsPath, //存放着此loader的绝对路径
    normal,
    pitch,
    raw,
    data: {}, //每个loader都有一个自已的自定久对象，可以有用来保存和传递数据
    pitchExecuted: false, //表示此loader的pitch已经执行过了
    normalExecuted: false, //表示此loader的normal函数已经执行过了
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

function iterateNormalLoaders(
  processOptions,
  loaderContext,
  args,
  pitchingCallback
) {
  if (loaderContext.loaderIndex < 0) {
    return pitchingCallback(null, args);
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      pitchingCallback
    );
  }
  let fn = currentLoader.normal; //就是loader里的normal函数
  currentLoader.normalExecuted = true;
  convertArgs(args, currentLoader.raw);
  //要以同步或者异步的方式执行fn
  runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
    if (err) pitchingCallback(err);
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      returnArgs,
      pitchingCallback
    );
  });
}

function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  let isSync = true; //默认fn的的执行是同步
  let isDone = false; //表示当前的函数是否已经完成了
  loaderContext.callback = (err, ...args) => {
    if (isDone) {
      throw new Error("callback(): The callback was already called.");
    }
    isDone = true;
    //callback 是不是要判断下isSync的值啊
    runCallback(err, ...args);
  };
  loaderContext.async = () => {
    isSync = false;
    return loaderContext.callback;
  };
  let result = fn.apply(loaderContext, args);
  //如果当前的执行是同步的话
  if (isSync) {
    isDone = true;
    runCallback(null, result);
  }
  //如果是异步，不会立刻调用runCallback,需要你在loader的内部手工触发callback,然后执行runCallback
}

function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
    processOptions.resourceBuffer = resourceBuffer; //要加载的资源的二进制数组 Buffer
    loaderContext.loaderIndex--;
    iterateNormalLoaders(
      processOptions,
      loaderContext,
      [resourceBuffer],
      pitchingCallback
    );
  });
}

function iteratePitchingLoaders(
  processOptions,
  loaderContext,
  pitchingCallback
) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, pitchingCallback);
  }
  //获取当前索引对应的loader对象
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }
  //因为我们要保证一个loader pitch或者说normal只走一次
  //获取当前loader对应的pitch函数
  let fn = currentLoader.pitch;
  currentLoader.pitchExecuted = true;
  if (!fn) {
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }
  runSyncOrAsync(
    fn,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, ...returnArgs) => {
      //判断pitch方法的返回值有没有，如果有则跳过后面的loader,返回头执行前一个loader
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

function runLoaders(options, finalCallback) {
  //resource要处理的资源，或者说要编译的模块路径
  //loaders处理此路径的loaders
  //context指的是loader函数在执行的时候this指针
  //readResource读取文件的方法fs.readFile
  const { resource, loaders = [], context = {}, readResource } = options;
  //loaders现在是一个loader模块的绝对路径，转成一个对象
  const loaderObjects = loaders.map(createLoaderObject);
  const loaderContext = context; //这个对象就是loader执行的时候的this指针
  loaderContext.resource = resource; //加载的模块
  loaderContext.readResource = readResource; //读取文件的方法
  loaderContext.loaders = loaderObjects; //存放loaders对象数组
  loaderContext.loaderIndex = 0; //当前正在处理的loader的索引
  loaderContext.callback = null; //可以手工调用此方法向后执行下一个loader
  loaderContext.async = null; //可以把loader运行从同步变为异步,并返回this.callback
  //代表整个请求 loader-1！loader2!a.js
  Object.defineProperty(loaderContext, "request", {
    get() {
      //把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      //把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      //把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      //把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "data", {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });
  const processOptions = {
    readResource, //fs.readFile
    resourceBuffer: null, //要读取的资源的源代码，它是一个Buffer,就二进制字节数组
  };
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    //pitchingCallback
    finalCallback(err, {
      result, //是最终处理的结果 ,其实就是最左则的loader的normal 返回值
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

exports.runLoaders = runLoaders;
