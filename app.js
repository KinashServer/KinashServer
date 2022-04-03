const http = require('http')
const fs = require('fs')
const mime = require('mime')
const rateLimit = require("http-ratelimit")
const config = require('./configs/config.json')
const server_version = '1.8.3.5'
const log = new console.Console(fs.createWriteStream('./logs/requests-log.txt'))
const errorlog = new console.Console(fs.createWriteStream('./logs/errors-log.txt'))


const server = http.createServer((req, res) => {

  function status(code) { res.statusCode = code }
  function sendHeader(header, value) { res.setHeader(header, value) }
  function writeContent(content) { res.write(content) }
  function endResponse(content) { res.end(content) }
  function info(content) { console.log('\x1b[0m\x1b[32m INFO >> ' + content); log.log('INFO >> ' + content) }
  function warning(content) { console.log('\x1b[0m\x1b[33m WARN >> ' + content); log.log('WARN >> ' + content); errorlog.log('WARN >> ' + content) }
  function error(content) { console.log('\x1b[0m\x1b[31m ERROR >> ' + content); log.log('ERROR >> ' + content); errorlog.log('ERROR >> ' + content) }
  
  function convert(replaceddata){
        replaceddata = replaceddata.replace('Encoding.setUTF(true)', '<meta charset="utf-8">')
        replaceddata = replaceddata.replace('KinashServer.getURL()', req.url)
        replaceddata = replaceddata.replace('KinashServer.getIP()', req.socket.remoteAddress)
        replaceddata = replaceddata.replace('KinashServer.getDate()', Date())
        replaceddata = replaceddata.replace('KinashServer.getRequestMethod()', req.method)
        replaceddata = replaceddata.replace('KinashServer.getCurrentMime()', mime.getType(req.url))
        replaceddata = replaceddata.replace('KinashServer.getVersion()', server_version)
        replaceddata = replaceddata.replace('KinashServer.refresh()', '<meta type="refresh" content="0"><script>location.reload()</script>')
        return replaceddata
  }
  

  function returnError(err, message, statusText) {
    status(err)
    sendHeader('Content-Type', 'text/html')
    if (err === 400 && message === null) { endResponse(convert(config.error400page)); return }
    if (err === 401 && message === null) { endResponse(convert(config.error401page)); return }
    if (err === 403 && message === null) { endResponse(convert(config.error403page)); return }
    if (err === 404 && message === null) { endResponse(convert(config.error404page)); return }
    if (err === 405 && message === null) { endResponse(convert(config.error405page)); return }
    if (err === 414 && message === null) { endResponse(convert(config.error414page)); return }
    if (err === 429 && message === null) { endResponse(convert(config.error429page)); return }
    if (err === 431 && message === null) { endResponse(convert(config.error431page)); return }
    if (err === 500 && message === null) { endResponse(convert(config.error500page)); }
    else { endResponse(`<html lang="en"><head><title>${err} ${statusText}</title></head><body><center><h1>${err} ${statusText}</h1><p>${message}</p></center></body></html>`) }
  }


  function readFile() {
    let read = './public_html' + req.url.split('?')[0]
    fs.readFile(read, 'utf8', (err, data) => {
      if (err) {
        returnError(404, null, null)
        return;
      }
      if (mime.getType(read).includes("image") == true || mime.getType(read).includes("audio") == true || mime.getType(read).includes("video") == true || mime.getType(read).includes("font") == true) {
        sendHeader('Content-type', mime.getType(req.url))
        let fileStream = fs.createReadStream(__dirname + '/./public_html' + req.url); //NOSONAR
        fileStream.pipe(res);
        return;
      }
      if (data.includes("KinashServer.returnError(400)") == true) { //TODO: Change to switch
        returnError(400, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(401)") == true) {
        returnError(401, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(403)") == true) {
        returnError(403, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(404)") == true) {
        returnError(404, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(405)") == true) {
        returnError(405, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(414)") == true) {
        returnError(414, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(429)") == true) {
        returnError(429, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(431)") == true) {
        returnError(431, null, null)
        return;
      }
      if (data.includes("KinashServer.returnError(500)") == true) {
        returnError(500, null, null)
        return;
      }
      sendHeader('Content-type', mime.getType(read))
      let replaceddata = data.replace('KinashServer.getURL()', req.url)
      for (let i = 0; i < config.maxkinashscripts; i++) {
        replaceddata = replaceddata.replace('Encoding.setUTF(true)', '<meta charset="utf-8">')
        replaceddata = replaceddata.replace('KinashServer.getURL()', req.url)
        replaceddata = replaceddata.replace('KinashServer.getIP()', req.socket.remoteAddress)
        replaceddata = replaceddata.replace('KinashServer.getDate()', Date())
        replaceddata = replaceddata.replace('KinashServer.getRequestMethod()', req.method)
        replaceddata = replaceddata.replace('KinashServer.getCurrentMime()', mime.getType(req.url))
        replaceddata = replaceddata.replace('KinashServer.getVersion()', server_version)
        replaceddata = replaceddata.replace('KinashServer.refresh()', '<meta type="refresh" content="0"><script>location.reload()</script>')
      }
      endResponse(replaceddata)
    })
  };

  rateLimit.inboundRequest(req)

  process.on('uncaughtException', function (err) {
    returnError(500, null, null)
    error('Error handling this user request!')
    error('Please report this error to our github: https://github.com/andriy332/KinashServer/')
    error(err.stack)
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

  if (rateLimit.isRateLimited(req, config.ratelimit_maximumrequests) == true) {
    returnError(429, null, null)
    return;
  }

  else if (req.url === '/') {
    fs.readFile(config.indexfile, { encoding: 'utf-8' }, function (err, data) {
      sendHeader('Content-Type', 'text/html')
      if (err) {
        returnError(500, null, null)
        error('Index file is missing')
      }
      let replaceddata = data.replace('KinashServer.getURL()', req.url)
      for (let i = 0; i < config.maxkinashscripts; i++) {
        replaceddata = replaceddata.replace('Encoding.setUTF(true)', '<meta charset="utf-8">')
        replaceddata = replaceddata.replace('KinashServer.getURL()', req.url)
        replaceddata = replaceddata.replace('KinashServer.getIP()', req.socket.remoteAddress)
        replaceddata = replaceddata.replace('KinashServer.getDate()', Date())
        replaceddata = replaceddata.replace('KinashServer.getRequestMethod()', req.method)
        replaceddata = replaceddata.replace('KinashServer.getCurrentMime()', mime.getType(req.url))
        replaceddata = replaceddata.replace('KinashServer.getVersion()', server_version)
        replaceddata = replaceddata.replace('KinashServer.refresh()', '<meta type="refresh" content="0"><script>location.reload()</script>')
      }
      endResponse(replaceddata)
    })	
  }

  else if (req.url.length > 10000) {
    returnError(431, null, null)
  } else if (req.url.includes("%") || req.url.includes("<") || req.url.includes(">") || req.url.includes("..")) {
    if (config.enablebasicsecuritychecks == true) {
      returnError(400, null, null)
      warning(req.socket.remoteAddress + ' tried to use exploit')
    }
    else { readFile() }
  } else if (req.url === config.authentication_url) {
    if (config.authentication_enabled == true) {
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
  } else if (req.url.includes('/login.html') == true) {
    returnError(403, null, null)
  } else if (req.url === '/robots.txt') {
    if (config.disallowcrawlers = true) {
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
  console.log('\x1b[0m\x1b[32m INFO >> Loading server')
  rateLimit.init(config.ratelimit_time, true);
  if (config.port === "80") {
    console.log('\x1b[0m\x1b[32m INFO >> Server started at http://' + config.host + '/')
  }
  else {
    console.log('\x1b[0m\x1b[32m INFO >> Server started at http://' + config.host + ':' + config.port + '/')
  }
})
