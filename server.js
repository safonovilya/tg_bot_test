const PORT = process.env.PORT;
const BOT_URL = process.env.BOT_URL;
//TODO: validate ENV vars
/*
var https = require('https');

var fs = require('fs');
var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

https.createServer(options, function (req, res) {
  res.end('secure!');
}).listen(443);
*/

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(301, { "Location": BOT_URL });
  res.end();
}).listen(PORT);

module.exports = {
  http: http
}