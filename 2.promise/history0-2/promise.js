// 1.Promise是一个类 天生的,类中需要传入一个executor 执行器,默认会立即执行

// 2.promise 内部会提供两个方法,可以更改promise的状态 3个状态： 等待态 成功态 失败态
// resolve 触发成功 (成功的内容) reject 触发失败 (失败的原因)  undefined
// 如果一旦promise成功了就不能失败,失败的情况 reject 、抛出异常
// 每个promise实例都要有一个then方法，分别是成功的回调和失败的回调
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED'; // 成功
const REJECTED = 'REJECTED'; // 失败

// resolvePromise(promise2,x,resolve,reject);
// 判断x的状态 是让promise2变成成功态还是失败态
function resolvePromise (promise2,x,resolve,reject){
    // 此方法 为了兼容所有的promise,n个库中间 执行的流程是一样的
    // 尽可能详细 不出错
    // 1) 不能引用同一个对象 可能会造成死循环
    if(promise2 === x){
        return reject(new TypeError('Chaining cycle detected for promise #<Promise> --'))
    }
    // 2) 判断x 的类型 x 如果是对象或者函数 说明他有可能是一个promise
    if((typeof x ==='object' && x!=null) || typeof x === 'function'){
        // 有可能是promise promise要有then方法
        try{
            let then = x.then;  // {a:1} 因为then方法 可能使用的getter来定义的
            if(typeof then === 'function'){ // 只能认为他是promise了
                // call 改变this指向 并且让函数执行
                then.call(x,(y)=>{ // 只取一次
                    resolve(y);
                },(r)=>{
                    reject(r);
                })
            }else{
                // {a:1,then:1}
                resolve(x)
            }
        }catch(e){
            reject(e); //取值失败 就走到error中
        }
    }else{
        resolve(x)
    }
}
class Promise {
    constructor(executor) { // 宏变量
        this.status = PENDING; // 默认是等待态
        this.value = undefined; // 成功的原因
        this.reason = undefined; // 失败的原因
        // 专门存放成功的回调的函数
        this.onResolvedCallbacks = [];
        // 专门存放失败的回调函数的
        this.onRejectedCallbacks = [];
        // 保证只有状态是等待态的时候 才能更改状态
        let resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = RESOLVED;
                // 需要让成功的方法依次执行
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        } // 执行executor 传入成功和失败
        try {
            executor(resolve, reject); // 立即执行
        } catch (e) {
            reject(e); // 如果内部出错直接将err手动的调用reject方法向下传递
        }
    }
    then(onfulfilled, onrejected) {
        // 为了实现链式调用 就创建一个新的promise
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
                // 执行then中的方法 可能返回的是一个普通值或者是promise 我要判断x的类型是不是一个promise，如果是promise的话 需要让这个promise执行，并且采用他的状态 作为promise的成功或者失败
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.value);
                        resolvePromise(promise2,x,resolve,reject);
                    } catch (e) { // 一旦执行then方法报错 就走到外层then的错误处理中，调用promise2的reject方法
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onrejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                // 这时候 executor是肯定有异步逻辑
                this.onResolvedCallbacks.push(() => {
                    // TODO... 切片编程
                    setTimeout(() => {
                        try{
                            let x = onfulfilled(this.value);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onrejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        } 
                    }, 0);
                })
            }
        })

        return promise2; // 返回这个promise
    }

}
module.exports = Promise;