const http = require('http');

const hostname = '127.0.0.1';
const port = 80;
const fs = require('fs');
const folder = "./public_html/"
const config = require('./configs/config.json');
const log = new console.Console(fs.createWriteStream('./logs/requests.txt'));

if (!fs.existsSync(folder)){
    fs.mkdirSync(folder, { recursive: true });
}

const server = http.createServer((req, res) => {
 log.log("[" + req.socket.remoteAddress + "] "+ Date() + " " + req.method + " " + req.url)
 console.log("[" + req.socket.remoteAddress + "] "+ Date() + " " + req.method + " " + req.url)
 if(req.url == "/"){
	 fs.open('./public_html/index.html', 'r', function(err, fileToRead){
    if (!err){
        fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err,data){
            if (!err){
            res.write(data);
            res.end();
            }else{
                	res.end(`<html><head>
    <title>No index file.</title>
</head><body>
<center>
    <h1>No index file.</h1>
    <p>The is no index.html file please create it in the "/public_html/" folder</p>
	<p>Also you can create a 404.html at "/public_html/" folder </p>
</center>
</body></html>`)
            }
        });
    }else{
                      	res.end(`<html><head>
    <title>No index file.</title>
</head><body>
<center>
    <h1>No index file.</h1>
    <p>The is no index.html file please create it in the "/public_html/" folder</p>
	<p>Also you can create a 404.html at "/public_html/" folder </p>
</center>
</body></html>`)
        
    }
});
 }
 else if(req.url == "/%%" || req.url == "/%"){
		res.statusCode = 400
	res.end(`<html><head>
    <title>Error 400</title>
</head><body>
<center>
    <h1>400 Bad Request</h1>
    <p>The request is invalid.</p>
</center>
</body></html>`)
 }
 else if(req.url.length > 100){
		res.statusCode = 414
	res.end(`<html><head>
    <title>Error 414</title>
</head><body>
<center>
    <h1>418 URI Too Long</h1>
    <p>The request url "/..." is too long to progress by the server.</p>
</center>
</body></html>`)
 }
   else if(req.url == config.blacklistedurls){
		res.statusCode = 403
	res.end(`<html><head>
    <title>Error 403</title>
</head><body>
<center>
    <h1>403 Forbidden</h1>
    <p>You don't have permission to use or view the page</p>
</center>
</body></html>`)
 }
 else{
	fs.open('./public_html/' + req.url, 'r', function(err, fileToRead){
    if (!err){
        fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err,data){
            if (!err){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
            }else{
                res.end('404 Not Found')
            }
        });
    }else{
		fs.open('./public_html/404.html', 'r', function(err, fileToRead){
		if (!err){
			fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err,data){
            if (!err){
				res.writeHead(404, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
            }else{
				res.statusCode = 404
                res.end(`<html><head>
    <title>Error 404</title>
</head><body>
<center>
    <h1>404 Not Found</h1>
    <p>The requested url` + req.url + `</p>
</center>
</body></html>`)
            }
        });
	 }else{
		res.statusCode = 404
        res.end(`<html><head>
    <title>Error 404</title>
</head><body>
<center>
    <h1>404 Not Found</h1>
    <p>The requested url` + req.url + `</p>
</center>
</body></html>`)
	 }
	});
    }
 });
}
});

server.listen(config.port, config.host, () => {
  console.log(`Server running at http://` + config.host + ":" + config.port + "/" );
});