const http = require("http");
const server_version = "Unknown"

http.createServer(function(request, response){
     
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    if(request.url == "/" || (request.url == "/favicon.ico")){
       		response.statusCode = 400;
        	response.setHeader("Server", "KinashServer");
		response.write("<center>");
		response.write("<h3>400 Bad Request</h3>");
		response.write("<p>This HTTP request was set HTTPS port [443]</p>");
		response.write("<p>KinashServer/" + server_version);
		response.write("</center>");
    }
    else{
       		response.setHeader("Server", "KinashServer");
		response.write("<center>");
        	response.statusCode = 403;
		response.write("<center>");
		response.write("<h3>403 Forbidden </h3>");
		response.write("<p>KinashServer/" + server_version);
		response.write("</center>");
    }
    response.end();
}).listen(443);
