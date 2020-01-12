// Promise.resolve
// let Promise = require('./promise');
// let p = new Promise((resolve,reject)=>{
//     resolve(100)
// });
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value)
    });
}
Promise.reject = function (value) {
    return new Promise((resolve, reject) => {
        reject(value)
    });
}
Promise.reject(new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('aaaa');
    }, 1000);
})).catch(data => {
    console.log(data);
})
// Promise.resolve 和 Promise.reject区别

// Promise.resolve这里可以接受一个promise
// Promise.reject接受promise不会有等待效果

// 作业：Promise.finally实现原理 es10
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally

// generator co  async / await
