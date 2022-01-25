const http = require('http')
const fs = require('fs')
const folder = '../public_html/'
const config = require('../configs/config.json')
const log = new console.Console(fs.createWriteStream('./logs/requests-log.txt'))
const errorlog = new console.Console(fs.createWriteStream('./logs/errors-log.txt'))
const errorslog = new console.Console(fs.createWriteStream('./logs/errors-log.txt'))
const mime = require('mime')
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true })
}
function returnError(err,message) {
  res.writeHead(err, { 'Content-Type': 'text/html' })
  if(err == "400") { res.write(error400page) }
  if(err == "401") { res.write(error401page) }
  if(err == "403") { res.write(error403page) }
  if(err == "404") { res.write(error404page) }
  if(err == "414") { res.write(error414page) }
  if(err == "500") { res.write(error504page) }
  res.write(`<h3>Error </h3>`)
  res.write(`<p>Error code: ${err}</p>`)
  res.write(`<o>${message}</o>`)
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-type', mime.getType(req.url))
  function readfile () {
    try {
      fs.readFile('./public_html' + req.url, 'utf8', (err, data) => {
        if (err) {
          returnError(404, null)
          return
        }
        res.end(data)
      })
    } catch (err) {
      returnError(500, null)
      throw new Error('A unknown error happend in user request! Please report this')
    }
  };
  process.on('uncaughtException', function (err) {
    returnError(500, null)
    console.error('\x1b[31m [ERROR] An error handling in user request')
    console.warn('\x1b[33m [WARN] Please report this bug to our github')
    console.warn('\x1b[33m [WARN] ERROR:')
    console.warn('\x1b[33m' + err + '\x1b[0m')
    errorlog.error('[ERROR] An error handling in user request')
    errorlog.warn('[WARN] Please report this bug to our github')
    errorlog.warn('[WARN] ERROR:')
    errorlog.warn(err)
  })
  log.log('[INFO] ' + '[' + req.socket.remoteAddress + '] ' + Date() + ' ' + req.method + ' ' + req.url)
  console.log('[INFO] ' + '\x1b[0m\x1b[32m [' + req.socket.remoteAddress + '] ' + Date() + ' ' + req.method + ' ' + req.url)
  if (req.url == '/') {
    fs.open('./public_html/index.html', 'r', function (err, fileToRead) {
      if (!err) {
        fs.readFile(fileToRead, { encoding: 'utf-8' }, function (err, data) {
          if (!err) {
 	    res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(data)
            res.end()
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end(config.errornoindexpage)
          }
        })
      } else {
	    	res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end(config.errornoindexpage)
      }
    })
  } else if (req.url == config.authentication_url) {
    const auth = { login: config.authentication_username, password: config.authentication_password }
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
      fs.readFile(config.authentication_file, 'utf8', function (err, data) {
        if (err) {
	  returnError(500, null)
	  console.warn('\x1b[33m[WARN] User ' + req.socket.remoteAddress + ' passed the authentication with but the authentication file doesnt exists \x1b[0m\x1b[32m')
        }
	 res.writeHead(200, { 'Content-Type': 'text/html' })
	 res.end(data)
	 console.warn('\x1b[33m[WARN] User ' + req.socket.remoteAddress + ' passed the authentication \x1b[0m\x1b[32m ')
      })
      return
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="' + config.authentication_realm + '"')
    returnError(401, null)
    console.warn('\x1b[33m[WARN] User ' + req.socket.remoteAddress + ' is tried to login (or failed the authentication)')
  } else if (req.url.includes === '/%') {
    returnError(400, null)
  } else if (req.url.length > config.max_url_length) {
    returnError(414, null)
  } else if (req.url === config.blacklistedurls) {
    returnError(403, null)
  } else if (req.url === '/login.html') {
    returnError(404, null)
  } else if (req.url === '/robots.txt') {
    if (config.disallowcrawlers == 'true') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write('User-agent: *')
      res.write('Disallow: /')
      res.end('Disallow: *')
    } else {
      readfile()
    }
  } else if (req.url === '/login.html/') {
    returnError(404, null)
  } else {
 	readfile()
  }
})
server.listen(config.port, config.host, () => {
  console.log('\x1b[0m\x1b[32m[INFO] Server started at http://' + config.host + ':' + config.port + '/')
})
