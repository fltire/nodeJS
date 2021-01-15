// 保存图片的服务
var express = require('express')
var path = require('path')
var app = express()
var {server} = require('./server')
const fs=require('fs');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '5000kb'}))
app.use('/',async function (req, res, next) {
    if(req.method=='POST'){
        let  s = await server(req.url,req.body,(e)=>{
          res.send(JSON.stringify(e));
        })
        console.log(s)
        if(s!=undefined){
            res.send(JSON.stringify(s));
        }
    }else{
        let str = req.url.substring(7,req.url.length)
        let url = req.url.substr(0,7)
        if(url == '/f/img/'){
            res.sendFile(path.join(__dirname, 'downImg/'+str));
        }else{
            res.send('123');
        }
    }
})
app.listen(8888, ()=>{
})
