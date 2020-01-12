let Promise = require('./promise');
let promise = new Promise((resolve,reject)=>{
    setTimeout(() => {
        reject('123')
    }, 1000);
});
// 发布订阅模式  支持一个promise可以then多次 ，等会改变状态后会让then中的函数执行
// [] []
promise.then((data)=>{
    console.log('res',data);
},(err)=>{ 
    console.log(err);
});
promise.then((data)=>{
    console.log('res',data);
},(err)=>{ 
    console.log(err);
});
