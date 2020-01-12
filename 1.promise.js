let fs = require('fs');
let Promise = require('./promise');
// 将异步方法 先转换成promise

// function read(...args) {
//     let dfd = Promise.defer(); // 延迟对象 可以解决promise的嵌套问题 ng1 
//     fs.readFile(...args, function (err, data) {
//         if (err) dfd.reject(err);
//         dfd.resolve(data);
//     });
//     return dfd.promise
// }
// let {promisify} = require('util');


function promisify(fn) {
    return function (...args) { // readFile
        return new Promise((resolve, reject) => {
            // fs.readFile('./name.txt','utf8')
            fn(...args, function (err, data) {
                if (err) reject(err);
                resolve(data);
            })
        })
    }
}
let readFile = promisify(fs.readFile);
// 直接将异步的node方法转化成promise方法
readFile('./name.txt', 'utf8').then(data => {
    return readFile(data, 'utf8')
}).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
})


// fs.readFile('./name.txt','utf8',function (err,data) {
//     if(err){

//     }
//     fs.readFile(data,'utf8',function (err,data) {
//         if(err){

//         }
//         console.log(data);
//     })
// })