# JavaScript的三种事件模型

面试中有时候会提到事件模型的概念，平时云里雾里的，所以找个机会总结一下，并不是很复杂的东西。

## DOM0事件模型（原始事件模型）
有两种实现方式:

通过元素属性来绑定事件
```html
<button onclick="click()">点我</button>
```

先获取页面元素，然后以赋值的形式来绑定事件

```js
const btn = document.getElementById('btn')
btn.onclick = function(){
    //do something
}
//解除事件
btn.onclick = null
```
DOM0缺点

**一个dom节点只能绑定一个事件，再次绑定将会覆盖之前的事件。**

## DOM2事件模型
dom2新增冒泡和捕获的概念，并且支持一个元素节点绑定多个事件。

### 事件捕获和事件冒泡（capture,bubble )

![](http://upload-images.jianshu.io/upload_images/4337988-1137f57e72c25ba1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如图所示1,2,3为捕获，4,5,6,7为冒泡，也就是说事件流分为三个阶段： DOM2 级事件模型共有三个阶段：

1. 事件捕获阶段：事件从 document 向下传播到目标元素，依次检查所有节点是否绑定了监听事件，如果有则执行。
2. 事件处理阶段：事件在达到目标元素时，触发监听事件。
3. 事件冒泡阶段：事件从目标元素冒泡到 document，并且一次检查各个节点是否绑定了监听函数，如果有则执行。

### addEventListener
这应该是大家用的最熟悉的事件绑定方法了。 addEventListener有三个参数 事件名称、事件回调、捕获/冒泡

```js
btn.addEventListener('click',function(){
    console.log('btn')
},true)
box.addEventListener('click',function(){
    console.log('box')
},false)
```

设置为true，则事件在捕获阶段执行，为false则在冒泡阶段执行。

## IE事件模型

IE事件只支持冒泡，所以事件流有两个阶段：

- 事件处理阶段：事件在达到目标元素时，触发监听事件。
- 事件冒泡阶段：事件从目标元素冒泡到 document，并且一次检查各个节点是否绑定了监听函数，如果有则执行。
实现方法：
```js
// 绑定事件
el.attachEvent(eventType, handler)

// 移除事件
el.detachEvent(eventType, handler)
```
改事件模型只在IE中有效，不兼容其他浏览器，所以大家了解一下就行。