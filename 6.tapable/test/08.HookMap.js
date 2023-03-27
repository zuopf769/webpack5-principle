// const { SyncHook, HookMap } = require("tapable");
const { SyncHook, HookMap } = require("../tapable");

const map = new HookMap(() => new SyncHook(["name"]));

map.for("key1").tap("plugin1", (name) => {
  console.log("plugin1", name);
});
map.for("key1").tap("plugin2", (name) => {
  console.log("plugin2", name);
});

map.for("key2").tap("plugin3", (name) => {
  console.log("plugin3", name);
});

map.get("key1").call("zuopf");
map.get("key2").call("jiagou");
