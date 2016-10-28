/*** config start ***/
var PROXY_PORT = '9529';            //对外端口
/*** config end ***/

var http = require('http');
var https = require('https');
var fs = require('fs');
var net = require('net');
var url = require('url');
var path = require('path');

function request(cReq, cRes) {
  var u = url.parse(cReq.url);

  console.log('on req', u);

  var options = {
    hostname : u.hostname, 
    port     : u.port || 80,
    path     : u.path,       
    method   : cReq.method,
    headers  : cReq.headers
  };

  var pReq = http.request(options, function(pRes) {
    cRes.writeHead(pRes.statusCode, pRes.headers);
    pRes.pipe(cRes);
    // pRes.end('dasdasdasd');
  }).on('error', function(e) {
    cRes.end();
  });

  cReq.pipe(pReq);
}

function connect(cReq, cSock) {
  var u = url.parse('http://' + cReq.url);

  console.log('on connect', u);

  var pSock = net.connect(u.port, u.hostname, function() {
    cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    pSock.pipe(cSock);
    // cSock.end("socket xxxxxxx");
  }).on('error', function(e) {
    cSock.end();
  });

  cSock.pipe(pSock);
}


// openssl genrsa -out private.pem 2048
// openssl req -new -x509 -key private.pem -out public.crt -days 99999
var options = {
  key  : fs.readFileSync('./private.pem'),
  cert : fs.readFileSync('./public.crt.127')
};
// cert : fs.readFileSync('./public.pem')

// var options = {
//       key: fs.readFileSync(path.join(__dirname, 'nodejs-self-signed-certificate-example', 'certs', 'server', 'privkey.pem'))
//     , cert: fs.readFileSync(path.join(__dirname, 'nodejs-self-signed-certificate-example', 'certs', 'server', 'fullchain.pem'))
//     };


// https.createServer(options, request)
// https.createServer(options, function(req ,res){
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, encrypted world xxxxxxx!');
// })
https.createServer(options)
// http.createServer()
  .on('request', request)
  .on('connect', connect)
  .listen(PROXY_PORT, '0.0.0.0');

console.log('https start');