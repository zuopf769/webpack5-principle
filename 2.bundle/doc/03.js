let age = 100
let obj = {}
Object.defineProperty(obj, 'age', { get: () => age })
let obj2 = { age: age }

console.log(obj.age, obj2.age) // 100

age = 200
console.log(obj.age, obj2.age) // 200
