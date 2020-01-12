
const Promise = require('./promise')
const promise = new Promise((resolve, reject) => { // executor 立即执行
    resolve('hello');
});
let promise2 = promise.then(() => {
    return   new Promise((resolve, reject) => {
        // 可能resolve出的结果还是一个promise
        resolve(new Promise((resolve,reject)=>{
            setTimeout(() => {
                resolve(new Promise((resolve,reject)=>{
                    setTimeout(() => {
                        reject('hello')
                    }, 1000);
                }))
            }, 1000);
        }))
    })
})
promise2.then().then().then((data) => {
    console.log('ssss:' + data);
}, (err) => {
    console.log(err)
})