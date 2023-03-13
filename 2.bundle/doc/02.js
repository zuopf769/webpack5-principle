let obj = {}
var ageValue = 10
Object.defineProperty(obj, 'age', {
  enumerable: true, //for in
  configurable: true, //delete obj.age
  //writable: true, //是否可修改
  //value: 10, //writeable 和 set不能混用
  get() {
    return ageValue
  },
  set(newValue) {
    ageValue = newValue
  }
})
console.log(obj.age)
obj.age = 100
console.log(obj.age)
