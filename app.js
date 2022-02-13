const http = require('http')
const fs = require('fs')
const mime = require('mime')
const config = require('./configs/config.json')
const folder = './public_html/'
const log = new console.Console(fs.createWriteStream('./logs/requests-log.txt'))
const errorlog = new console.Console(fs.createWriteStream('./logs/errors-log.txt'))

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true })
}

const server = http.createServer((req, res) => {

  function status (code) {
    res.statusCode = code
  }

  function sendHeader (header, value) {
    res.setHeader(header, value)
  }

  function writeContent (content) {
    res.write(content)
  }

  function endResponse (content) {
    res.end(content)
  }

  function info (content) {
    console.log('\x1b[0m\x1b[32m INFO >> ' + content)
    log.log('INFO >> ' + content)
  }

  function warning (content) {
    console.log('\x1b[0m\x1b[33m WARN >> ' + content)
    log.log('WARN >> ' + content)
  }

  function error (content) {
    console.log('\x1b[0m\x1b[31m ERROR >> ' + content)
    log.log('ERROR >> ' + content)
  }

  function returnError (err, message, statusText) {
    status(err)
    sendHeader('Content-Type', 'text/html')
    if (err === 400 || message === "null") {
		endResponse(config.error400page)
		return 
    }
    if (err === 401 || message === "null") {
		endResponse(config.error401page)
		return 
    }
    if (err === 403 || message === "null") {
		endResponse(config.error403page)
		return 
    }
    if (err === 404 || message === "null") {
		endResponse(config.error404page)
		return 
    }
    if (err === 405 || message === "null") {
		endResponse(config.error405page)
		return 
    }
    if (err === 414 || message === "null") {
		endResponse(config.error414page)
		return 
    }
    if (err === 431 || message === "null") {
		endResponse(config.error431page)
		return 
    }
    if (err === 500 || message === "null") {
		endResponse(config.error500page)
		return 
    }
    else{
        writeContent('<center>')
        writeContent(`<h1>${err} ${statusText}</h1>`)
        writeContent(`<p>${message}</p>`)
        endResponse('</center>')
    }
  }

  function accessDenied (reason) {
    warning('Denied user request from ' + req.socket.remoteAddress + ' to ' + req.url)
    warning('Reason: ' + reason)
    returnError(403, null, null)
  }

	
	
  function readFile () {
    try {
      fs.readFile('./public_html' + req.url, 'utf8', (err, data) => {
        if (err) {
          returnError(404, null, null)
          return
        }
        sendHeader('Content-type', mime.getType(req.url))
        endResponse(data)
      })
    } catch (err) {
      returnError(500, null, null)
      error('Unknown error')
      throw new Error('A unknown error happend in user request! Please report this to our github')
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
    warning('authentication_url' + config.authentication_url)
    warning('authentication_username' + config.authentication_username)
    warning('authentication_realm' + config.authentication_realm)
    warning('authentication_file' + config.authentication_file)
    warning('max_url_length' + config.max_url_length)
    warning('disallowcrawlers' + config.disallowcrawlers)
  })

  info(req.socket.remoteAddress + ' ' + req.method + ' ' + req.url + ' ' + Date())

  if(req.method ===! 'GET'){
    returnError(405, null, null)
  }

  else if(req.url.length > 9999){
    returnError(431, null, null)
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
    const auth = { login: config.authentication_username, password: config.authentication_password }
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
      fs.readFile(config.authentication_file, 'utf8', function (err, data) {
        if (err) {
          returnError(500, null, null)
          warning('User ' + req.socket.remoteAddress + ' passed the authentication')
          error('Error: The authentication file is missing')
        }
        sendHeader('Content-Type', 'text/html')
        endResponse(data)
        warning('User ' + req.socket.remoteAddress + ' passed the authentication')
      })
      return
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="' + config.authentication_realm + '"')
    returnError(401, null, null)
    warning('User ' + req.socket.remoteAddress + ' is tried to login (or failed the authentication)')
  } else if (req.url.length > config.max_url_length) {
    returnError(414, null, null)
  } else if (req.url === '/login.html' || req.url === '/login.html/') {
    accessDenied('This page is protected.')
  } else if (req.url === '/robots.txt') {
    if (config.disallowcrawlers === 'true') {
      info('Returning default robots.txt page (because disallow crawlers is on in config.json)')
      sendHeader('Content-type', 'text/plain')
      writeContent('User-agent: *')
      endResponse('Disallow: /')
    } else {
      readFile()
    }
  } else {
    readFile()
  }
})

server.listen(config.port, config.host, () => {
  //info() doesn't work here, so use console.log()
  console.log('\x1b[0m\x1b[32m INFO >> Server started at http://' + config.host + ':' + config.port + '/')
})
