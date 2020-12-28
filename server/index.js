var http = require('http');
var {server} = require('./server')
http.createServer(async function(req,res){
    // res.setHeader('access-control-allow-origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    res.writeHead(200, {'Content-Type': 'utf-8'});
    var body = ''
    req.on('data', function (chunk) {
        body+= decodeURI(chunk); //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
        // body = querystring.parse(body)
        body = eval('('+body+')')
    });
      req.on( 'end',async  ()=> {
        // 解析参数
        // let data = querystring.parse(body); //将一个字符串反序列化为一个对象
        // console.log('data',data)
        if(req.method=='POST'){
          console.log(req.url)
          console.log(body)
            let  s = await server(req.url,body)
            // console.log(s,'34');
            res.write(JSON.stringify(s));
            res.end();
        }else{
            res.write('123');
            res.end();
        }
      });
    // let urlname = url.parse(req.url).pathname
    // let s = await server(urlname,query)
    // res.write(JSON.stringify(s));
}).listen(8888)
