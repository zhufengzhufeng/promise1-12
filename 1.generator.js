// generator 生成器 生成的是迭代器
// 普通函数执行时 没有停止功能，generator函数 可以暂停
// function * read() {
//     yield 1; // 产出
//     yield 2; // 产出
//     yield 3; // 产出
//     yield 4; // 产出
// }

// let it = read(); // iterator 迭代器中包含一个next方法

// // 迭代器接口 Symbol.iterator
// let done = false;
// while(!done){
//     let obj  =  it.next();
//     done = obj.done;
//     console.log(obj.value);
// }
// console.log(it.next()); // {value,done} 配到yield关键字就停止了
// console.log(it.next()); 



// ---------------
// es6特性
// function * read() {
//     let a = yield 1;
//     console.log('a'+a);
//     let b = yield 2; 
//     console.log('b'+b);
//     let c = yield 3;
//     console.log(c); 
// }
// let it = read();

// it.next('xxx'); // 第一次传递的参数 是无意义的
// it.next('world'); // next传递参数会给上一次yield的返回值
// it.next('xxx');

// generator + promise
const util = require('util');
const fs = require('fs');
let read = util.promisify(fs.readFile);
function * readAge(){ // 暂停的功能
    let content =  yield read('./name.txt','utf8');
    let age = yield {}
    return age;
}
// tj 
function co(it){
    return new Promise((resolve,reject)=>{
        // 异步迭代 需要next函数
        function next(r){
            let {value,done} = it.next(r);
            if(done){
                resolve(value);
            }else{
                Promise.resolve(value).then(data=>{
                    next(data);
                },reject)
            }
        }
        next();
    })
}
co(readAge()).then(data=>{
    console.log(data);
});

function * test() {
    try{
       yield 100 
    }catch{
        console.log('error')
    }
   
}
let it = test();
it.next();
it.throw('hello')

// 依次去执行生成器 不停的调用next方法 将最终结果返回


// let it = readAge();
// let {value} = it.next();
// value.then(data=>{
//    let {value} =  it.next(data);
//    value.then(data=>{
//         let {value,done} =  it.next(data);
//         console.log(value,done)
//     })
// })


// 他编译出来的结果就是generator + co
async function  test() { // async 函数返回的就是一个promise 
       let r = await new Promise((resolve,reject)=>{
           setTimeout(() => {
               reject('hello')
           }, 1000);
       });
       console.log(r);
    
}
test().catch(err=>{
    console.log(err);
});

// 回去把promise原理搞定
// 1) 柯里化和反柯里化
// 2) finally方法 race方法