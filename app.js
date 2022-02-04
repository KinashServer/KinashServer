const http = require('http')
const fs = require('fs')
const folder = './public_html/'
const config = require('./configs/config.json')
const log = new console.Console(fs.createWriteStream('./logs/requests-log.txt'))
const errorlog = new console.Console(fs.createWriteStream('./logs/errors-log.txt'))
const mime = require('mime')
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true })
}

const server = http.createServer((req, res) => {
  function statusCode (code) {
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
  
  function returnError (err, message) {
    res.writeHead(err, { 'Content-Type': 'text/html' })
    if (err === '400') { res.end(config.error400page); return }
    if (err === '401') { res.end(config.error401page); return }
    if (err === '403') { res.end(config.error403page); return }
    if (err === '404') { res.end(config.error404page); return }
    if (err === '405') { res.end('Unsupported method'); return }
    if (err === '414') { res.end(config.error414page); return }
    if (err === '500') { res.end(config.error500page); return }
    writeContent('<h3>Error</h3>')
    writeContent(`<p>Error code: ${err}</p>`)
    endResponse(`<u>${message}</u>`)
  }

  function readFile () {
    try {
      fs.readFile('./public_html' + req.url, 'utf8', (err, data) => {
        if (err) {
          returnError(404, null)
          return
        }
        sendHeader('Content-type', mime.getType(req.url))
        endResponse(data)
      })
    } catch (err) {
      returnError(500, null)
      error('Unknown error')
      throw new Error('A unknown error happend in user request! Please report this to our github')
    }
  };
  
  
  process.on('uncaughtException', function (err) {
    returnError(500, null)
    error('Error handling this user request!')
    error('Please report it to our github: https://github.com/andriy332/KinashServer/')
    error('ERROR: ' + err)
    warning('Do not forget to share full server log')
  })
  
  info('[' + req.socket.remoteAddress + '] ' + Date() + ' ' + req.method + ' ' + req.url)
  
  if(req.method ===! 'GET'){
    returnError(405, null)
  }
  
  else if (req.url === '/') {
    fs.open('./public_html/index.html', 'r', function (err, fileToRead) {
      if (!err) {
        fs.readFile(fileToRead, { encoding: 'utf-8' }, function (err, data) {
          if (!err) {
            statusCode(200)
            sendHeader('Content-type', 'text/html')
            endResponse(data)
          } else {
            returnError(404, null)
          }
        })
      } else {
        returnError(503, 'Default index.html file is missing')
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
          returnError(503, 'Authentication file is missing.')
          warning('User ' + req.socket.remoteAddress + ' passed the authentication')
          error('Error: the authentication file is missing')
        }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        endResponse(data)
        warning('User ' + req.socket.remoteAddress + ' passed the authentication')
      })
      return
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="' + config.authentication_realm + '"')
    returnError(401, null)
    warning('User ' + req.socket.remoteAddress + ' is tried to login (or failed the authentication)')
  } else if (req.url.length > config.max_url_length) {
    returnError(414, null)
  } else if (req.url === '/login.html') {
    returnError(403, null)
    warning('Denied user request ' + req.socket.remoteAddress + ' to ' + req.url)
    warning('Reason: This page is protected')
  } else if (req.url === '/robots.txt') {
    if (config.disallowcrawlers === 'true') {
      info('Returning default robots.txt page (because disallow crawlers is on)')
      statusCode(200)
      sendHeader('Content-type', 'text/plain')
      writeContent('User-agent: *')
      endResponse('Disallow: /')
    } else {
      readFile()
    }
  } else if (req.url === '/login.html/') {
    returnError(403, null)
    warning('Denied user request ' + req.socket.remoteAddress + ' to ' + req.url)
    warning('Reason: This page is protected')
  } else {
    readFile()
  }
})

server.listen(config.port, config.host, () => {
  //info() doesn't work here so use console.log()
  console.log('\x1b[0m\x1b[32m INFO >> Server started at http://' + config.host + ':' + config.port + '/')
})
