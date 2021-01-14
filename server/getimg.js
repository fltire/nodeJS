// 打开、显示图片的服务
var express = require('express')
var path = require('path')
var app = express()

app.use('/', function (req, res, next) {
    console.log(req.url)
    res.sendFile(path.join(__dirname, 'downImg'+req.url));
})
app.listen(8083, ()=>{
    console.log('Server is running at http://localhost:8083')
})