// promise  https://promisesaplus.com/
// 目前低版本浏览器 ie 不支持 需要polyfill es6-promise(这个包实现了promise)

// 高版本都支持了promise 


// promise 是为了解决异步问题的 恶魔金子塔 并发异步处理

// 有可能别人写的promise是一个函数
let Promise = require('./promise');
let promise = new Promise((resolve,reject)=>{
    resolve('xxx')
    //throw new Error('错误')
    //reject('val');
});
promise.then((data)=>{ // onfulfilled 成功
    console.log('res',data);
},(err)=>{ // onrejected 失败
    console.log(err);
});

