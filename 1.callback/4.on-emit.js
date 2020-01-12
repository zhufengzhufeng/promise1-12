let fs = require('fs'); 
// 订阅好一件事 当这件事发生的时候 触发对应的函数
// 订阅 on 发布 emit promise内部也是基于发布订阅的

let e = {
    _obj:{},
    _callback:[],
    on(callback){ // 订阅 就是将函数放到数组中
        this._callback.push(callback);
    },
    emit(key,value){
        this._obj[key] = value; // 让订阅的数组中的方法 依次执行
        this._callback.forEach(fn=>{
            fn(this._obj);
        })
    }
}
// 只要发布了 就应该让订阅的事执行
e.on(function (obj) { // 每次发布都会触发此函数
    console.log('获取一个')
})
e.on(function (obj) { // 每次发布都会触发此函数
    // es5 的方法 可以将对象 转化成数组
    if(Object.keys(obj).length === 2){ // 用户根据结果自己决定输出
        console.log(obj);
    }
})
// 多个类之间可以解除耦合关系
fs.readFile('./age.txt','utf8',function (error,data) { // 5s
    e.emit('age',data);
})
fs.readFile('./name.txt','utf8',function (error,data) { // 3s
    e.emit('name',data);
});


// 发布订阅 所有库中都存在发布订阅  特点是 订阅方和发布方 没有任何的关系
// 观察者模式 观察者 被观察者 
