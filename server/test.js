var http = require('http'); // 引入模块
var mysql = require('mysql'); // 引入模块
var connection = mysql.createConnection({
    host:'localhost', //主机地址
    user:'root', // 用户名
    password:'root', //密码
    database:'demo' //数据库名
})
connection.connect()
http.createServer(async function(req,res){
    res.setHeader('access-control-allow-origin', '*'); // 跨域
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    res.writeHead(200, {'Content-Type': 'utf-8'});
    var body = ''
    req.on('data', function (chunk) {
        body+= decodeURI(chunk); //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
        body = eval('('+body+')')
    });
      req.on( 'end',async  ()=> {
        // 解析参数
        if(req.method=='POST'){
            let  s = await url(req.url,body) // body是传的参数
            res.write(JSON.stringify(s));
            res.end();
        }else{
            res.write('123');
            res.end();
        }
      });

}).listen(9808)
// 判断接口
function url(url,data){
    switch(url){
        case '/list':
            return list()
    }
}
function list(){
    // 查询数据库
    return server('SELECT * from user')
}
// 操作数据库
async function server(sql){
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