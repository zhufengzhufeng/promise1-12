let Promise = require('./promise')
const promise = new Promise((resolve,reject)=>{ // executor 立即执行
   resolve('hello');
});

// 因为你调用了 resolve('hello')
// let promise2 = promise.then((data)=>{
//     return 100; // promise.resolve(100)
// })
// promise2.then((data)=>{
//     console.log('success:'+data);
// })
// 1.每次调用then方法时 都返回一个新的promise实例


// 1) step 1 引用同一个对象
let promise2 = promise.then(()=>{
   throw new Error('errer')
})
promise2.then((data)=>{
    console.log('ssss:'+data);
},(err)=>{
    console.log(err)
})



