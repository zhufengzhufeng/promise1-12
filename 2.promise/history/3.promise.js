// promise可以解决链式调用问题 jquery .then.then 
// 先通过原生看效果 -> 写原理

let promise = new Promise((resolve,reject)=>{
    resolve('hello'); // 普通值意味着不是一个promise
});

let p1 = promise.then(data=>{
    return data; // then方法中可以返回一个值(不是promise),会把这个结果放到下一次then的成功的回调中
})
let p2 = p1.then(data=>{
    return new Promise((resolve)=>{ // 如果返回的是一个promise 那么会采用这个promise的结果
        setTimeout(() => {
            resolve('hello');
        }, 1000);
    })
}).then(data=>{
    return new Promise((resolve,reject)=>{ // 如果返回的是一个promise 那么会采用这个promise的结果
        setTimeout(() => {
            reject('world');
        }, 1000);
    })
}).then(()=>{

}).then(()=>{
    console.log('成功');
    throw new Error('失败了');
},()=>{

}).then(()=>{},(err)=>{
    console.log('失败')
}).catch(err=>{ // 捕获错误，先找距离自己最近的如果没有错误捕获 会找到最终的catch方法
    console.log(err);
}).then(()=>{
    console.log('then')
})

// 什么时候走成功 then中返回的是一个普通值 或者是一个promise的时候（成功的promise）
// 失败情况 返回的是一个失败的promise 、 抛出异常也会走 失败

// catch的特点是如果都没有错误处理（一层层找）没有找到错误处理 会找最近的catch,catch也是then 遵循then 的规则
// .then.then 并不是和jquery一样 返回this promise中实现链式调用主要靠的是返回一个新的promise

// let p = new Promise((resolve,reject)=>{
//     resolve(1);
// })
// let p1 = p.then(()=>{})
// let p2 = p1.then(()=>{})
// console.log(p1 === p2);