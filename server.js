const http = require('http');

const fs = require('fs');
const folder = "./public_html/"
const config = require('./configs/config.json');
const log = new console.Console(fs.createWriteStream('./logs/requests-log.txt'));
const errorlog = new console.Console(fs.createWriteStream('./logs/error-log.txt'));
const nosslsupport = require('./src/nosslsupport.js');
const mime = require('mime');

if (!fs.existsSync(folder)){
    fs.mkdirSync(folder, { recursive: true });
}



const server = http.createServer((req, res) => {
	


	
process.on('uncaughtException', function (err) {
	res.statusCode = 500
	res.end(config.error500page)
console.error('\x1b[31m [ERROR] An error handling in user request')
console.warn('\x1b[33m [WARN] Please report this bug to our github')
console.warn('\x1b[33m [WARN] ERROR:')
console.warn('\x1b[33m' + err)
console.log('\x1b[0m')

errorlog.error("[ERROR] An error handling in user request")
errorlog.warn('[WARN] Please report this bug to our github')
errorlog.warn("[WARN] ERROR:")
errorlog.warn(err)
return
});
	
	
	
 log.log("[INFO] " + "[" + req.socket.remoteAddress + "] "+ Date() + " " + req.method + " " + req.url)
 console.log("[INFO] " + "\x1b[0m\x1b[32m [" + req.socket.remoteAddress + "] "+ Date() + " " + req.method + " " + req.url)
 if(req.url == "/"){
	fs.open('./public_html/index.html', 'r', function(err, fileToRead){
	if (!err){
        fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err,data){
            if (!err){
 	    res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
            }else{
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(config.errornoindexpage)
            }
        });
    }else{
	    	res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(config.errornoindexpage)
        
    }
});
 }
 else if(req.url == config.authentication_url){
  const auth = {login: config.authentication_username, password: config.authentication_password}
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  if (login && password && login === auth.login && password === auth.password) {
	fs.readFile(config.authentication_file, 'utf8', function (err,data) {
  if (err) {
	  res.writeHead(500, {'Content-Type': 'text/html'});
	  res.end(config.error500noauthpage)
	  console.warn('\x1b[33m [WARN] User ' + req.socket.remoteAddress + ' passed the authentication with error \x1b[0m\x1b[32m')
  }
	 res.writeHead(200, {'Content-Type': 'text/html'});
	 res.end(data)
	 console.warn('\x1b[33m[WARN] User ' + req.socket.remoteAddress + ' passed the authentication \x1b[0m\x1b[32m ')
});
	return;
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="' + config.authentication_realm + '"')
  res.writeHead(401, {'Content-Type': 'text/html'});
  res.end(config.error401page)
console.warn('\x1b[33m[WARN] User ' + req.socket.remoteAddress + ' is tried to login (or failed the authentication)')
 }
 else if(req.url.includes == "/%"){
	res.writeHead(400, {'Content-Type': 'text/html'});
	res.end(config.error400page)
 }
 else if(req.url.length > config.maxurl){
	res.writeHead(414, {'Content-Type': 'text/html'});
	res.end(config.error414page)
 }
 else if(req.url == config.blacklistedurls){
	res.writeHead(403, {'Content-Type': 'text/html'});
	res.end(config.error403page)
 }
 else if(req.url == "/login.html"){
	res.writeHead(403, {'Content-Type': 'text/html'});
	res.end(config.error403page)
 }
else if(req.url == "/login.html/"){
	res.writeHead(403, {'Content-Type': 'text/html'});
	res.end(config.error403page)
 }
 else{
	try {	
		fs.readFile('./public_html' + req.url, 'utf8' , (err, data) => {
		if (err) {
			res.statusCode = 404
			res.end(config.error404page)
			return
		}
		res.end(data)
})
	} catch (err) {
		res.statusCode = 500
		res.write(config.error500page)
	        console.error('\x1b[31m [ERROR] An error handling this user request')
		console.error('\x1b[31m [ERROR] try { fail (148 line)')
	}
};
});

server.listen(config.port, config.host, () => {
  console.log(`\x1b[0m\x1b[32m[INFO] Server started at http://` + config.host + ":" + config.port + "/" );
});
