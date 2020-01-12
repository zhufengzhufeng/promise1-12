// 对某些函数进行扩展 面向切片编程 

function say(who) { // 装饰
    console.log('say',who)
}
// 在说话之前 去干一些事 在说话之前先刷牙
Function.prototype.before = function (callback) { // 统一扩展了公共方法
    // 箭头函数中没有 this 没有arguments

    // args 就是当前参数的一个数组  ['我']
    return  (...args) => { // newSay  箭头函数中没有this指向 会像上级作用域查找
        callback();
        // 展开运算符 可以将数组展开依次传入
        this(...args);// this指向怎么看 就是谁调用这个方法 this就是谁
    }
}
let newSay = say.before(function () {
    console.log('刷牙');
})
newSay('我');
// 原型链 prototype __proto__