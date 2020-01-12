// 什么叫高阶函数 “异步”中 
// 什么叫异步 1） 执行后的返回结果不能立马获取  ajax 等待同步代码执行后 才会获取最终结果

// node中 文件操作都是异步的
let fs = require('fs'); //读写文件

// 异步的解决方案 最早就是基于回调函数的 不能使用trycatch 来解决异常
// node中的回调函数的第一个参数 永远是error
// 回调地狱 恶魔金子塔


// 读取age和name 用他们的结果 作为一个对象

// 基于回调的方式来获取最终结果
function after(times,callback){ // lodash
    // times 会保存在当前的执行上下文中
    let  renderObj  = {};
    return function (key,value) { // out
        renderObj[key] = value;
        if(--times == 0){ // times 永远取的是外层作用域下的变量
            callback(renderObj);
        }
    }
}
let out = after(2,function (renderObj) {
    console.log(renderObj);
});
// error first 错误第一
fs.readFile('./age.txt','utf8',function (error,data) { // 5s
    // renderObj['age'] = data;
    out('age',data);
})
fs.readFile('./name.txt','utf8',function (error,data) { // 3s
    // renderObj['name'] = data;
    out('name',data);
});


// 发布订阅 所有库中都存在发布订阅
// 观察者模式