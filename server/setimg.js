// 保存图片的服务
var express = require('express')
var path = require('path')
var app = express()
const fs=require('fs');
var bodyParser = require('body-parser')

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'demo'
})
connection.connect()
var urlHead = 'D:/work/ss/nodeJS/server/downImg/' //图片保存的位置
deleteFolderRecursive = function(url) {
      
  fs.unlink(url,function(error){
    if(error){
        console.log(error);
        return false;
    }
    console.log('删除文件成功');
  })

};
async function c(sql){
    let s
    await new Promise(resolve=>{
        connection.query(sql,  (error, results, fields)=> {
            if (error) throw error;
            resolve(results)
        })
    })
    .then((res)=>{
        s = res
    })
    return s
}

async function img(e,id){
    let b = await c(`select * from user where user_id = ${id}`)
    deleteFolderRecursive(urlHead+b[0].img);
    let s = await c(`update user set img = '${e}' where user_id = ${id}`)
    if(s.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '5000kb'}))
app.post('/upload', function(req, res){
    // console.log(req.body)
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    // 返回一个被 string 的值初始化的新的 Buffer 实例,原始二进制数据存储在 Buffer 类的实例中，        一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。
    var dataBuffer = Buffer.from(base64Data, 'base64');
    var date = new Date().getTime()
    fs.writeFile(urlHead+date+".png", dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
            img(date+'.png',req.body.userId)
          res.send({img:date+'.png'});
        }
    });
});
app.use('/', function (req, res, next) {
    console.log(req.method)
  if(req.url=='/upload'){
    next()
    return
  }
  console.log(req.url)
  res.sendFile(path.join(__dirname, 'downImg'+req.url));
})
app.listen(8078, ()=>{
})
