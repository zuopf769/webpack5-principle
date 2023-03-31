// html-webpack-plugin如何向compilation上挂载额外的钩子？

let compilation = {
  hooks: {
    emit: new SyncHook(),
  },
};
// 在html-webpack-plugin内部拿到compilation的hooks后就可以在他上面加额外的钩子
compilation.hooks.alterAssetTagGroups = new SyncHook();
