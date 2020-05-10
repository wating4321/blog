# this到底指向哪里？
老生常谈的问题了，之前一直有些模糊，这次争取一次写清楚。

## 指向只与调用有关
不论代码多么复杂我们只关心到底是谁最后调用的this就可以了。

来看一个例子：
```js
var obj = {
    foo: function(){
      console.log(this)
    }
  }
  
var bar = obj.foo
obj.foo() // obj
bar() //  window
```
为什么最后两行所打印出的this不同？还是那句话 **“谁最后调用的this，this就指向谁。”**

- 先看第一行调用foo()函数的对象是obj，所以this指向obj。
- 前面没有调用的对象那么就是全局对象 window，所以调用bar()函数的对象是全局window，相当于window.bar()，所以this指向window（严格模式下全局为undifined）
## 改变this指向的方法
### 箭头函数下的this
箭头函数下的this有些特殊，函数体内的this对象就是定义时的所在的对象，而不是使用时所在的对象。

例子：
```js
function Timer(){
    this.s1 = 0
    this.s2 = 0

    setInterval(()=> this.s1++,1000)
    setInterval(function(){
        this.s2 ++
    },1000)

}

let timer = new Timer()

setTimeout(() => console.log(timer.s1),3100) //  3
setTimeout(() => console.log(timer.s2),3100) //  0
```

上面的例子，Timer函数内部设置了两个定时器，分别使用了箭头函数和普通函数，箭头函数的this指向函数定义时所在的作用于（即Timer函数），普通函数的this指向调用时所在的作用于（即全局对象window）。所以，3100ms之后，timer.s1加到了3，而timer.s2一次都没有更新。

### apply & call
apply call bind 都可以改变this的指向，这里先说apply 和 call 的区别。 **apply 和 call 的区别是 call 方法接受的是若干个参数列表，而 apply 接收的是一个包含多个参数的数组。**

- apply
```js
var a ={
    fn : function (a,b) {
        console.log( a + b)
    }
}
var b = a.fn;
b.apply(a,[1,2])     // 3
```
call
```js
var a ={
    fn : function (a,b) {
        console.log( a + b)
    }
}
var b = a.fn;
b.call(a,1,2)       // 3
```
### bind 和 call apply
直接看MDN上面的介绍：

>bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

```js
var a ={
    fn : function (a,b) {
        console.log( a + b)
    }
}
var b = a.fn;
b.bind(a,1,2)()           // 3
```