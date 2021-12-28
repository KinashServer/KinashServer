const http = require('http');
const config = require('../configs/config.json');
var page = `<html><head>
    <title>Error 500 - No SSL Support</title>
</head><body>
    <p>SSL not supported</p>
</body></html>`


const requestListener = function (req, res) {
  res.writeHead(500);
  res.end(page);
}

const server = http.createServer(requestListener);

server.listen(443, config.host, () => {
  console.log(`\x1b[0m\x1b[32m[INFO] Http error listener started at http://` + config.host + ":" + '443' + "/" );
})
