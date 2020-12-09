var ws = require("nodejs-websocket");


var server = ws.createServer(function(connect){
    connect.on("text", function (str) {
        console.log(str)
        server.connections.forEach((connect)=>{
            connect.sendText(str)
        })
    })
    connect.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    connect.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8787)

