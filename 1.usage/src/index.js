function readonly(target, key, descriptor) {
  descriptor.writable = false;
}
class Person {
  @readonly PI = 3.14
}
const person = new Person();
person.PI = 3.15;
const a = 1;
const b = 2;
const c = 3;
const d = 4;
