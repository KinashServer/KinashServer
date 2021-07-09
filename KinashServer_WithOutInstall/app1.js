const http = require("http");
const server_version = "1.3"
http.createServer(function(request, response){
    console.info('\x1b[32m User: ' + request.method + '  ' + request.url)
    console.info('\x1b[32m Server: 200 OK - ' + 'CustomRequestHeaders: Server: KinashServer')
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    if(request.url === "/" || request.url === "/home" ){
        response.setHeader("Server", "KinashServer");
        response.statusCode = 200;
        response.write('Index')
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
	response.write("<center>");
	response.write("<h3>403 Forbidden </h3>");
	response.write("<p>KinashServer/" + server_version);
	response.write("</center>");
    }
    else{
 	console.info('\x1b[31m User: ' + request.method + '  ' + request.url)
  	console.info('\x1b[31m Server: 404 Not Found - ' + 'CustomRequestHeaders: Server: KinashServer')
    	response.statusCode = 404;
	response.write("<center>");
	response.write("<h3>404 Not Found </h3>");
	response.write("<p>KinashServer/" + server_version);
	response.write("</center>");
    }
    response.end();
}).listen(80);
