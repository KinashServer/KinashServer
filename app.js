const http = require('http')
const proxylib = require('http-proxy');
const fs = require('fs')
const mime = require('mime')
const config = require('./configs/config.json')
const proxyconfig = require('./configs/proxy.json')
const folder = './public_html/'
const server_version = '1.8.0'
const log = new console.Console(fs.createWriteStream('./logs/requests-log.txt'))
const errorlog = new console.Console(fs.createWriteStream('./logs/errors-log.txt'))
const proxy = proxylib.createProxyServer();

const server = http.createServer((req, res) => {

  function status (code) { res.statusCode = code }
  function sendHeader (header, value) { res.setHeader(header, value) }
  function writeContent (content) { res.write(content) }
  function endResponse (content) { res.end(content) }
  function info (content) { console.log('\x1b[0m\x1b[32m INFO >> ' + content); log.log('INFO >> ' + content) }
  function warning (content) { console.log('\x1b[0m\x1b[33m WARN >> ' + content); log.log('WARN >> ' + content); errorlog.log('WARN >> ' + content) }
  function error (content) { console.log('\x1b[0m\x1b[31m ERROR >> ' + content); log.log('ERROR >> ' + content); errorlog.log('ERROR >> ' + content) }

  function returnError (err, message, statusText) {
    status(err)
    sendHeader('Content-Type', 'text/html')
    if (err === 400 && message === null) { endResponse(config.error400page); return }
    if (err === 401 && message === null) { endResponse(config.error401page); return }
    if (err === 403 && message === null) { endResponse(config.error403page); return }
    if (err === 404 && message === null) { endResponse(config.error404page); return }
    if (err === 405 && message === null) { endResponse(config.error405page); return }
    if (err === 414 && message === null) { endResponse(config.error414page); return }
    if (err === 431 && message === null) { endResponse(config.error431page); return }
    if (err === 500 && message === null) { endResponse(config.error500page); }
    else { endResponse(`<html lang="en"><head><title>${err} ${statusText}</title></head><body><center><h1>${err} ${statusText}</h1><p>${message}</p></center></body></html>`) }
  }
	
	
  function readFile () {
    try {
      fs.readFile('./public_html' + req.url, 'utf8', (err, data) => {
        sendHeader('Content-type', mime.getType(req.url))
        endResponse(data)
      })
    } catch (err) {
        returnError(404, null, null)
        return
    }
  };

  process.on('uncaughtException', function (err) {
    returnError(500, null, null)
    error('Error handling this user request!')
    error('Please report this error to our github: https://github.com/andriy332/KinashServer/')
    error(err)
    warning('Do not forget to send full server log')
    warning('And do not forget to send this details: ')
    warning('Server version: ' + server_version)  
    warning('Request url: ' + req.url)
    warning('Request method: ' + req.method)
    warning('authentication_realm: ' + config.authentication_realm)
    warning('authentication_file: ' + config.authentication_file)
    warning('max_url_length: ' + config.max_url_length)
    warning('disallowcrawlers: ' + config.disallowcrawlers)
    warning('enablebasicsecuritychecks: ' + config.enablebasicsecuritychecks)
  })

  info(req.socket.remoteAddress + ' ' + req.method + ' ' + req.url + ' ' + Date())

  if(req.url.length > 10000){
    returnError(431, null, null)
  }

  else if(req.url === proxyconfig.proxy1url) {
	proxy.on('error', function (err, req1, res1) {
	   status(502)
           res1.end(proxyconfig.badgatewayerrorpage);
	})
 
  	proxy.web(req1, re1s, { target: proxyconfig.proxy1target });
  }
	
  else if(req.url === proxyconfig.proxy2url) {
	proxy.on('error', function (req2, res2) {
	   status(502)
           res2.end(proxyconfig.badgatewayerrorpage);
	})
 
  	proxy.web(req2, res2, { target: proxyconfig.proxy2target });
  }
	
  else if(req.url === proxyconfig.proxy3url) {
	proxy.on('error', function (req3, res3) {
	   status(502)
           res3.end(proxyconfig.badgatewayerrorpage);
	})
 
  	proxy.web(req3, res3, { target: proxyconfig.proxy3target });
  }
	
  else if(req.url === proxyconfig.proxy4url) {
	proxy.on('error', function (req3, res3) {
	   status(502)
           res4.end(proxyconfig.badgatewayerrorpage);
	})
 
  	proxy.web(req4, res4, { target: proxyconfig.proxy4target });
  }
  
  else if(req.url === proxyconfig.proxy5url) {
	proxy.on('error', function (req5, res5) {
	   status(502)
           res5.end(proxyconfig.badgatewayerrorpage);
	})
 
  	proxy.web(req5, res5, { target: proxyconfig.proxy5target });
  }
 else if(req.url.includes("%") || req.url.includes("<") || req.url.includes(">") || req.url.includes("..")){
   if(config.enablebasicsecuritychecks = true){
	returnError(400, null, null)
   	warning(req.socket.remoteAddress + ' tried to use exploit')
   }
   else { readFile() }
  }

  else if (req.url === '/') {
    fs.open('./public_html/index.html', 'r', function (err, fileToRead) {
      if (!err) {
        fs.readFile(fileToRead, { encoding: 'utf-8' }, function (err, data) {
          if (!err) {
            sendHeader('Content-type', 'text/html')
            endResponse(data)
          } else {
            returnError(404, null, null)
          }
        })
      } else {
        returnError(500, null, null)
        error('The index.html file is missing')
      }
    })
  
  } else if (req.url === config.authentication_url) {
   if(config.authentication_enabled = true){
    const auth = { login: config.authentication_username, password: config.authentication_password }
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
      fs.readFile(config.authentication_file, 'utf8', function (err, data) {
        if (err) {
          returnError(500, null, null)
          warning('User ' + req.socket.remoteAddress + ' passed the authentication')
          error('The authentication file is missing')
        }
        sendHeader('Content-Type', 'text/html')
        endResponse(data)
        warning('User ' + req.socket.remoteAddress + ' passed the authentication')
      })
      return
    }
    sendHeader('WWW-Authenticate', 'Basic realm="' + config.authentication_realm + '"')
    returnError(401, null, null)
    warning('User ' + req.socket.remoteAddress + ' is tried to login (or failed the authentication)')
   } else { readFile() }
  } else if (req.url.length > config.max_url_length) {
    returnError(414, null, null)
  } else if (req.url === '/login.html' || req.url === '/login.html/') {
    returnError(403, null, null)
  } else if (req.url === '/robots.txt') {
    if (config.disallowcrawlers === 'true') {
      sendHeader('Content-type', 'text/plain')
      writeContent('User-agent: *')
      endResponse('Disallow: /')
    } else {
      readFile()
    }
  } else { readFile() }
})

server.listen(config.port, config.host, () => {
  //info() doesn't work here, so use console.log()
  console.log('\x1b[0m\x1b[32m INFO >> Server started at http://' + config.host + ':' + config.port + '/')
})
