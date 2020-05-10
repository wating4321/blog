# 吃透ES6----let和const
ES6 在原有两种声明变量命令（var和function）的基础上，又加入了一共四种声明变量的命令let const import class，本文先对let和const的用法进行说明。

## let
先说说let，同样是变量声明let相对于var引入了块级作用域的概念。
```js
{
  var a = 1
  let b = 2
}
console.log(a) //  1
console.log(b) //  ReferenceError: b is not defined
```
这个例子说明了同样是在外部调用代码块内部声明的变量，结果用let声明的报错，用var声明的返回值。 这说明用let声明的变量只在声明时的代码块可用。 最典型的例子就是这道面试题了：
```js
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 10
a[7](); // 10
a[8](); // 10
a[9](); // 10
```
之所以每次输出的值都是10，是因为用var声明的变量没有块级作用域的特性，会进行变量提升，所以i就是全局变量，每一次遍历都会把之前的i覆盖掉。 如果用let就不会发生这样的情况：
```js
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```
因为let声明的变量只在当前代码块内有效，所以每次遍历的i都是独立的，互不影响。 另外对于for循环的代码块还有一个特殊的地方，就是循环变量的地方是一个作用域，循环体内部有又是一个单独的作用域：
```js
for(let i = 0 ; i < 3 ; i++){
  let i = 'inside'
  console.log(i)
}

//"inside"
//"inside"
//"inside"
```
输出三次‘inside’，表明函数内部的i和循环变量i分别在不同的作用域。

### 再也没有变量提升
用var声明的变量会有变量提升的情况，大家应该都很熟悉，但是这其实并不符合正常的逻辑，变量应该在声明语句之后才可以使用。
```js
console.log(a)  // undefined
var a = 1  
console.log(a) // ReferenceError: a is not defined
let a = 1  
```
### 暂时性死区（temporal dead zone）
在用let声明变量的同时会绑定（binding）这个区域，使变量不受外部影响
```js
var a = 'outside'
if(true){
  console.log(a) // ReferenceError
  let a
}
```
可以看出在代码块中使用let声明变量之前，该变量都是不可用的，这在语法上称为“暂时性死区”（temporal dead zone）

### 不允许重复声明
let 不允许在相同的代码块中重复声明相同的变量
```js
//报错
function foo() {
  let a = 10
  var a = 1
}
foo()
// 报错
function foo() {
  let a = 10
  let a = 1
}
foo()
```
即使像这样也不行：
```js
//报错
function foo(a) {
  let a = 10
}
foo()
```
### 块级作用域
ES6 之前只有全局作用域和函数作用域，这样带来了很多棘手的问题。 比如：
```js
var a = 10
function f () {
  console.log(a)
  if(true){
      var a
  }
}
f()
// undefined
```
上面代码本来是if代码块使用自己内部的a，函数内使用外部的a，但是因为变量提升的问题，导致if代码块内的a影响到了外部的a，所以函数执行后输出undefined。 在ES6引入了let之后事情就变得简单许多，let的作用实际上就是给JavaScript引入了块级作用域。
```js
function foo(){
  let i = 10
  if(true){
    let i = 20
  }
  console.log(i) // 10
}
foo()
```
上面代码说明用let内部的代码不会影响外部的代码。

## const
const和let的区别是，声明的是一个只读常量，一旦声明，值就不能改变。
```js
const a = 1
a = 2
// 报错
```
const所声明的常量不能改变，所以声明和赋值的过程必须同时进行。
```js
const a
// 报错
```
const的作用域与let相同，都具有块级作用域的概念。
```js
if(true){
  const a = 10
}
console.log(a) // a is not defined
```
const也不会有变量提升的操作，所以同样存在暂时性死区，只能在声明后使用。
```js
if(true){
  console.log(a)
  const a = 10
}
// ReferenceError: a is not defined
```
同样不可重复声明
```js
const a = 1
const a = 2
// SyntaxError: Identifier 'a' has already been declared
```
### const声明的变量真的不能改变吗？
对于简单类型的数据（数值、字符串、布尔值）而言，值确实是不能改变，但对于复杂类型（对象和数组），变量保存的只是指向内存地址的指针，const只能保证这个指针不会被改变，至于指针所指的内容则完全不受控制。 数组：
```js
const arr = []
arr[0] = 1
console.log(arr) // [1]
arr = [2]  // 报错
```
对象：
```js
const obj = {}
obj.a = 123
obj.a // 123
```