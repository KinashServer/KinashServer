const http = require("http");
const server_version = "1.3"
const ip = "0.0.0.0"
//WARNING: if you want to start server on localhost 
//set ip to "0.0.0.0" NOT 172.0.0.1
http.createServer(function(request, response){
    console.info('\x1b[32m User: ' + request.method + '  ' + request.url)
    console.info('\x1b[32m Server: 200 OK - ' + 'CustomRequestHeaders: Server: KinashServer')
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    if(request.url === "/"){
           response.setHeader("Server", "KinashServer");
           response.statusCode = 200;
           response.write(`
		   <title>Server works!</title>
		   <p style="color:gray">
		   Index file
		   </p>
		   `)
    }
    else if(request.url === "/old"){
 	   console.info('\x1b[33m User: ' + request.method + '  ' + request.url)
  	   console.info('\x1b[33m Server: 302 TempRedirect - ' + 'CustomRequestHeaders: Server: KinashServer')
           response.statusCode = 302;
           response.setHeader("Server", "KinashServer");
           response.setHeader("Location", "/new");
    }
    else if(request.url == "/new"){
           response.setHeader("Server", "KinashServer");
           response.write("<p>You are redirected from /old to /new</p>");
    }
    else if(request.url == "/Forbidden"){
 	    console.info('\x1b[31m User: ' + request.method + '  ' + request.url)
  	    console.info('\x1b[31m Server: 403 Forbidden - ' + 'CustomRequestHeaders: Server: KinashServer')
        response.setHeader("Server", "KinashServer");
       	response.statusCode = 403;
    }
    else{
 	    console.info('\x1b[31m User: ' + request.method + '  ' + request.url)
  	    console.info('\x1b[31m Server: 404NotFound - ' + 'CustomRequestHeaders: Server: KinashServer')
		response.setHeader("Server", "KinashServer");
    	response.statusCode = 404;
    }
    response.end();
}).listen(80, ip);
