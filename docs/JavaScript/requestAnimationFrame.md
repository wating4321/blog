# 使用requestAnimationFrame来提升动画性能

![](https://user-gold-cdn.xitu.io/2018/5/20/1637ddf84e9110d6?w=550&h=365&f=jpeg&s=59063)

##  传统动画的弊端
在实际项目中我们经常会遇到生成动画的需求，传统方法是通过使用setTimeout和setInterval进行实现，但是定时器动画有两个弊端：

- 时间间隔并不好拿捏，设置太短浏览器重绘频率太快会产生性能问题，太慢的话又显得像PPT不够平滑，业界推荐的时间间隔是16.66...（显示器刷新频率是60Hz，1000ms/60）
- 浏览器UI线程堵塞问题，如果UI线程之中有很多待完成的渲染任务，所要执行的动画就会被搁置。

为了解决这些问题HTML5加入了requestAnimationFrame


##  requestAnimationFrame？
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
>window.requestAnimationFrame() 方法告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。

- requestAnimationFrame会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率

- 在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的CPU、GPU和内存使用量

- requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销

##  用法
你可以直接调用`requestAnimationFrame()`，也可以通过window来调用`window.requestAnimationFrame()`。
requestAnimationFrame()接收一个函数作为回调，返回一个ID值，通过把这个ID值传给`window.cancelAnimationFrame()`可以取消该次动画。

MDN上给的例子：
```js
var start = null;
var element = document.getElementById('SomeElementYouWantToAnimate');
element.style.position = 'absolute';

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}
```
##  例子
我们来试试生成一个旋转并逐渐变窄的方块，当窄到一定程度又会复原循环往复。
[jsbin看看效果](http://jsbin.com/xeferik/3/edit?js,output)
```js
var rotate = 0;
var width = 400;
var element = document.getElementById('box');

function step(timestamp) {
    rotate += 10
    element.style.transform = `rotate(${rotate}deg)`;
    window.requestAnimationFrame(step);
}

function small(timestamp) {
    width = width - 1
    element.style.width = width + 'px';
    if (width <= 50) {
        window.requestAnimationFrame(big);
    } else {
        window.requestAnimationFrame(small);
    }
}
function big() {
    width = width + 1
    element.style.width = width + 'px';
    if (width >= 400) {
        window.requestAnimationFrame(small);
    } else {
        window.requestAnimationFrame(big);
    }
}

window.requestAnimationFrame(step);
window.requestAnimationFrame(small);
```
##  浏览器兼容情况
我们来看一下[Can I Use](https://caniuse.com/## search=requestAnimationFrame)上的兼容情况：
![](https://user-gold-cdn.xitu.io/2018/5/20/1637d6be4df448ce?w=1718&h=781&f=png&s=80112)
requestAnimationFrame的兼容情况还是不错的（看不见IE）

如果非要兼容IE的话可以用定时器来做一下兼容：
```js
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            /*调整时间，让一次动画等待和执行时间在最佳循环时间间隔内完成*/
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
```