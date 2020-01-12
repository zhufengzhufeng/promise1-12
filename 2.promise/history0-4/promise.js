
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED'; // 成功
const REJECTED = 'REJECTED'; // 失败

function resolvePromise (promise2,x,resolve,reject){
    // 此方法 为了兼容所有的promise,n个库中间 执行的流程是一样的
    // 尽可能详细 不出错
    // 1) 不能引用同一个对象 可能会造成死循环
    if(promise2 === x){
        return reject(new TypeError('Chaining cycle detected for promise #<Promise> --'))
    }
    let called; 
    if((typeof x ==='object' && x!=null) || typeof x === 'function'){
        try{
            let then = x.then;  // {a:1} 因为then方法 可能使用的getter来定义的
            if(typeof then === 'function'){ // 只能认为他是promise了
                // call 改变this指向 并且让函数执行
                then.call(x,y=>{ // 只取一次 当前promise解析出来的结果可能还是一个promise继续解析直到他是一个普通值为止
                    // 递归解析resolve的值
                    if(called) return;
                    called = true;
                    resolvePromise(promise2,y,resolve,reject)
                },r=>{
                    if(called) return;
                    called = true;
                    reject(r);
                })
            }else{
                // {a:1,then:1}
                resolve(x)
            }
        }catch(e){ //  我取then出错了 在错误中又掉了该promise的成功
            if(called) return
            called = true;
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
            // 增加
            if(value instanceof Promise){
                value.then(resolve,reject);// 递归解析直到是普通值位置
                return;
            }
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
    catch(errCallback){ // catch就是没有成功的then方法
        return this.then(null,errCallback)
    }
    then(onfulfilled, onrejected) {
        onfulfilled = typeof onfulfilled == 'function'?onfulfilled:v=>v;
        onrejected = typeof onrejected == 'function'?onrejected:err=>{throw err}
        // 为了实现链式调用 就创建一个新的promise
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
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
Promise.defer = Promise.deferred = function () { // 稍后继续说 catch
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
module.exports = Promise;

// npm install -g promises-aplus-tests