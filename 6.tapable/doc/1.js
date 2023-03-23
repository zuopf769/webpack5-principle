// 函数声明
function sum(a, b) {
  return a + b;
}

// 函数表达式
const minus = (a, b) => a - b;

// 函数声明和函数表达式都是语法糖

//这个函数等价于底下那个new Function
/* 
function multiply(a, b) {
    return a * b;
} 
*/

// 也可拼一个字符串
// 参数也可以分开多个传递，Function(arg0, arg1, /* … ,*/ argN, functionBody)
let multiply = new Function("a,b", "return a*b");
console.log(multiply(2, 3));
