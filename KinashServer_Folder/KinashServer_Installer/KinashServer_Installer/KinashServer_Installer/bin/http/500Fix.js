const http = require("http");
const version_server = "???"
http.createServer(function(request, response){
     
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    if(request.url === "/"){
        response.setHeader("Server", "KinashServer");
        response.statusCode = 500;
	response.write("<center>");
	response.write("<h3>500 Internal Server Error </h3>");
	response.write("<p>Something went wrong with server config.</p>");
	response.write("<p>KinashServer/" + version_server);
	response.write("</center>");
    }
    else{
        response.setHeader("Server", "KinashServer");
        response.statusCode = 500;
	response.write("<center>");
	response.write("<h3>500 Internal Server Error </h3>");
	response.write("<p>Something went wrong with server config.</p>");
	response.write("<p>KinashServer/" + version_server);
	response.write("</center>");
    }
    response.end();
}).listen(3000);